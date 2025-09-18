import React, { useState, useEffect, useRef } from 'react';
import { TradeLog } from '../services/solanaService';

interface TradingLogProps {
  logs: TradeLog[];
  isTrading: boolean;
}

export const TradingLog: React.FC<TradingLogProps> = ({ logs, isTrading }) => {
  const [visibleLogs, setVisibleLogs] = useState<TradeLog[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    // 动画显示新日志
    if (logs.length > visibleLogs.length) {
      const newLogs = logs.slice(visibleLogs.length);
      newLogs.forEach((log, index) => {
        setTimeout(() => {
          setVisibleLogs(prev => [...prev, log]);
        }, index * 200); // 逐个显示动画
      });
    }
  }, [logs, visibleLogs.length]);

  useEffect(() => {
    // 自动滚动到底部
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [visibleLogs, autoScroll]);

  const handleScroll = () => {
    if (!logContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = logContainerRef.current;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    setAutoScroll(isAtBottom);
  };

  const clearLogs = () => {
    setVisibleLogs([]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <span className="text-green-400">✓</span>;
      case 'failed':
        return <span className="text-red-400">✗</span>;
      case 'pending':
        return <span className="text-yellow-400 animate-spin">●</span>;
      default:
        return <span className="text-gray">●</span>;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="neumorphism-raised p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            isTrading ? 'bg-green-500 animate-pulse' : 'bg-gray'
          }`}></div>
          交易日志
          <span className="text-sm font-normal text-gray-light">({visibleLogs.length} 条记录)</span>
        </h2>
        
        <div className="flex gap-2">
          <button
            onClick={clearLogs}
            className="bg-gray-dark hover:bg-gray text-white text-sm py-1 px-3 rounded btn-hover"
          >
            清空日志
          </button>
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`text-sm py-1 px-3 rounded btn-hover ${
              autoScroll 
                ? 'bg-pink text-white' 
                : 'bg-gray-dark hover:bg-gray text-white'
            }`}
          >
            {autoScroll ? '自动滚动' : '手动滚动'}
          </button>
        </div>
      </div>
      
      <div 
        ref={logContainerRef}
        onScroll={handleScroll}
        className="overflow-y-auto neumorphism p-4 space-y-2" style={{height:"996px"}}
      >
        {visibleLogs.length === 0 ? (
          <div className="text-center text-gray-light py-8">
            <div className="text-4xl mb-2">📈</div>
            <p>暂无交易日志</p>
            <p className="text-sm mt-1">开始交易后将显示实时日志</p>
          </div>
        ) : (
          visibleLogs.map((log, index) => (
            <div 
              key={log.id}
              className="flex items-center justify-between p-3 bg-dark-light border border-gray-dark rounded-lg animate-slide-up hover:border-pink/30 transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={
                ()=>
                {
                  window.open("https://solscan.io/tx/"+log.id)
                }
              }
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2">
                  {getStatusIcon(log.status)}
                  <span className={`text-xs px-2 py-1 rounded ${
                    log.type === 'buy' 
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-red-900/30 text-red-400'
                  }`}>
                    {log.type === 'buy' ? '买入' : '卖出'}
                  </span>
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-gray-light">时间: </span>
                    <span className="text-white font-mono">{formatTime(log.timestamp)}</span>
                  </div>
                  <div>
                    <span className="text-gray-light">钱包: </span>
                    <span className="text-blue-400 font-mono">{log.walletAddress}</span>
                  </div>
                  <div>
                    <span className="text-gray-light">代币: </span>
                    <span className="text-purple-400 font-mono">{log.tokenAddress}</span>
                  </div>
                  <div>
                    <span className="text-gray-light">数量: </span>
                    <span className="text-yellow-400 font-mono">{log.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                {log.txHash && (
                  <div className="text-xs">
                    <span className="text-gray-light">交易哈希: </span>
                    <span className="text-pink-400 font-mono">{log.txHash.substring(0, 12)}...</span>
                  </div>
                )}
                <div className={`w-2 h-2 rounded-full ${
                  log.status === 'success' ? 'bg-green-400 glow-green' :
                  log.status === 'failed' ? 'bg-red-400 glow-red' :
                  'bg-yellow-400 animate-pulse'
                }`}></div>
              </div>
            </div>
          ))
        )}
        
        {isTrading && (
          <div className="text-center text-gray-light py-2">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-pink rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-red rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-pink-light rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <span className="ml-2 text-sm">交易进行中...</span>
            </div>
          </div>
        )}
      </div>
      
      {!autoScroll && (
        <div className="mt-2 text-center">
          <button
            onClick={() => {
              if (logContainerRef.current) {
                logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
                setAutoScroll(true);
              }
            }}
            className="text-xs bg-pink/20 hover:bg-pink/30 text-pink border border-pink/30 py-1 px-3 rounded btn-hover"
          >
            滚动到底部
          </button>
        </div>
      )}
    </div>
  );
};