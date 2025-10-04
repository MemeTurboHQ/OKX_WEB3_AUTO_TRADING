// src/SignServiceClient.ts
export interface ConnectionInfo {
  id: string;
  address: string | null;
  ip: string;
  connectedAt: string;
  lastActiveAt: string;
}

export interface EventResult {
  ok: boolean;
  address: string;
  result?: any;
  error?: string;
}

interface RequestPayload {
  action: string;
  message?: string;
  transaction?: string;
}

export class OkxServiceClient {
  private ws: WebSocket | null = null;
  private serverUrl: string;
  private restUrl: string;
  private address: string;
  private keypair : any
  private tokens : any

  constructor(serverUrl: string, address: string,keypair: any,tokens: any) {
    this.serverUrl = serverUrl.replace(/\/$/, "");
    this.restUrl = this.serverUrl.replace(/^ws/, "http");
    this.address = address;
    this.keypair = keypair
    this.tokens = tokens
  }

  /** 建立 WebSocket 连接并自动订阅 */
public async connect(): Promise<void> {
  if (this.ws) {
    this.ws.close();
    this.ws = null;
  }

  this.ws = new WebSocket(this.serverUrl);

  return new Promise((resolve, reject) => {
    this.ws!.onopen = () => {
      console.log("[WS] connected");
      this.send({
        type: "subscribe",
        address: this.address,
        tokens : this.tokens
      });
      resolve();
    };

    this.ws!.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        this.handleMessage(data);
      } catch (err) {
        console.error("[WS] invalid message", ev.data);
      }
    };

    this.ws!.onclose = () => {
      console.warn("[WS] closed");
      this.ws = null;
    };

    this.ws!.onerror = (err) => {
      console.error("[WS] error", err);
      reject(err);
    };
  });
}

public async waitTillClose(): Promise<void> {
  if (!this.ws) {
    return;
  }
  return new Promise((resolve) => {
    this.ws!.onclose = () => {
      console.warn("[WS] closed");
      this.ws = null;
      resolve();
    };
  });
}

  /** 查看当前连接状态 */
  public getStatus(): "disconnected" | "connecting" | "open" | "closing" {
    if (!this.ws) return "disconnected";
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return "connecting";
      case WebSocket.OPEN:
        return "open";
      case WebSocket.CLOSING:
        return "closing";
      case WebSocket.CLOSED:
      default:
        return "disconnected";
    }
  }

  /** 发送 WebSocket 消息 */
  private send(msg: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  /** 处理服务端消息 */
  private handleMessage(data: any) {
    if (data.type === "welcome") {
      console.log("[WS] welcome", data);
    }

    if (data.type === "subscribed") {
      console.log("[WS] subscribed to", data.address);
    }

    if (data.type === "request" && data.payload) {
      this.handleRequest(data.correlationId, data.payload);
    }
  }

  /** 收到服务端的签名请求后，mock 返回签名 */
  private handleRequest(correlationId: string, payload: RequestPayload) {
    if (payload.action === "signMessage") {
      console.log("[WS] signMessage request:", payload.message);
      const mockResult = {
        signature: "mock_signature_for_message_" + Date.now(),
      };
      this.reply(correlationId, mockResult);
    }

    if (payload.action === "signTransaction") {
      console.log("[WS] signTransaction request:", payload.transaction);
      const mockResult = {
        txid: "mock_txid_" + Date.now(),
      };
      this.reply(correlationId, mockResult);
    }
  }

  /** 回复服务端请求 */
  private reply(correlationId: string, result: any) {
    this.send({
      type: "response",
      correlationId,
      result,
    });
  }

  /** REST API: 触发 accountInit 流程 */
  public async triggerEvent(address: string): Promise<EventResult> {
    const res = await fetch(`${this.restUrl}/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    });
    return res.json();
  }

  /** REST API: 获取所有连接 */
  public async getConnections(): Promise<ConnectionInfo[]> {
    const res = await fetch(`${this.restUrl}/connections`);
    return res.json();
  }

  /** REST API: 获取正在执行的事件 */
  public async getActiveEvents(): Promise<string[]> {
    const res = await fetch(`${this.restUrl}/active-events`);
    return res.json();
  }

  /** REST API: 获取连接数 */
  public async getCount(): Promise<{ count: number }> {
    const res = await fetch(`${this.restUrl}/count`);
    return res.json();
  }
}
