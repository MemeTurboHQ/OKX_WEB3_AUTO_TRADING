import React, { useState, useEffect, useRef } from 'react';
import { SolanaService, TradeLog } from './services/solanaService';
import { WalletManager } from './components/WalletManager';
import { TokenManager } from './components/TokenManager';
import { TradingControl } from './components/TradingControl';
import { TradingLog } from './components/TradingLog';
import './index.css';
import { VolManager } from './components/VolManager';
import { SlippageManager } from './components/SlippageManager';

function App() {
  const solanaServiceRef = useRef<SolanaService>(new SolanaService());
  const [tradeLogs, setTradeLogs] = useState<TradeLog[]>([]);
  const [isTrading, setIsTrading] = useState(false);
  const [statistics, setStatistics] = useState({
    totalTrades: 0,
    successfulTrades: 0,
    failedTrades: 0,
    successRate: 0,
    totalVolume: 0
  });

  // 统计数据更新
  useEffect(() => {
    const total = tradeLogs.length;
    const successful = tradeLogs.filter(log => log.status === 'success').length;
    const failed = tradeLogs.filter(log => log.status === 'failed').length;
    const successRate = total > 0 ? (successful / total) * 100 : 0;
    const totalVolume = tradeLogs.reduce((sum, log) => sum + log.amount, 0);

    setStatistics({
      totalTrades: total,
      successfulTrades: successful,
      failedTrades: failed,
      successRate,
      totalVolume
    });
  }, [tradeLogs]);

  // 处理新的交易日志
  const handleTradeLog = (newLog: TradeLog) => {
    setTradeLogs(prev => [...prev, newLog]);
  };

const cleanTradeLog = () => setTradeLogs([]);
  // 处理交易状态变化
  const handleTradingStatusChange = (trading: boolean) => {
    setIsTrading(trading);
  };

  // 重置所有数据
  const handleReset = () => {
    solanaServiceRef.current.stopTrading();
    setTradeLogs([]);
    setIsTrading(false);
    solanaServiceRef.current.destroy();
    solanaServiceRef.current = new SolanaService();
  };

  // 组件卸载时清理资源
  useEffect(() => {
    return () => {
      solanaServiceRef.current.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-dark p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 animate-glow-pulse bg-gray-800 px-4 py-2 rounded-3xl">
            OKX BOOST VOL TRADING (Solana)
          </h1>

          {/* <p className="text-gray-light">
            专业的Solana自动交易工具 - 批量管理多个钱包进行代币交易
          </p> */}
        </div>

        {/* 统计数据 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="neumorphism-raised p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{statistics.totalTrades}</div>
            <div className="text-xs text-gray-light">总交易数</div>
          </div>
          <div className="neumorphism-raised p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{statistics.successfulTrades}</div>
            <div className="text-xs text-gray-light">成功交易</div>
          </div>
          <div className="neumorphism-raised p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{statistics.failedTrades}</div>
            <div className="text-xs text-gray-light">失败交易</div>
          </div>
          {/* <div className="neumorphism-raised p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{statistics.successRate.toFixed(1)}%</div>
            <div className="text-xs text-gray-light">成功率</div>
          </div> */}
          <div className="neumorphism-raised p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{statistics.totalVolume.toFixed(2)}</div>
            <div className="text-xs text-gray-light">总交易量</div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* 左侧控制面板 */}
          <div className="space-y-6">
            <WalletManager 
              solanaService={solanaServiceRef.current}
              onWalletsImported={() => {/* 钱包导入成功 */}}
            />
            
            <TokenManager 
              solanaService={solanaServiceRef.current}
              onTokensImported={() => {/* 代币导入成功 */}}
            />
            <VolManager
              solanaService={solanaServiceRef.current}
              onVolChanged={(vol:any) => {
                console.log("change vol ::",vol)
              }}
            />
            <TradingControl 
              solanaService={solanaServiceRef.current}
              onTradingStatusChange={handleTradingStatusChange}
              onTradeLog={handleTradeLog}
            />

            {/* 操作按钮 */}
            <div className="neumorphism-raised p-6">
              <h3 className="text-lg font-bold text-white mb-4">系统操作</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleReset}
                  disabled={isTrading}
                  className="bg-gray-dark hover:bg-gray text-white font-medium py-3 px-4 rounded-lg btn-hover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  重置系统
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg btn-hover"
                >
                  刷新页面
                </button>
              </div>
            </div>

            {/* 安全提示 */}
            <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4">
              <h4 className="text-yellow-400 font-bold mb-2">⚠️ 安全提示</h4>
              <ul className="text-yellow-300 text-sm space-y-1">
                <li>• 请保护好您的私钥，不要泄露给他人</li>
                <li>• 请根据实际需求调整交易参数</li>
                <li>• 注意网络状况和GAS情况</li>
              </ul>
            </div>
          </div>

          {/* 右侧日志面板 */}
          <div>
            <TradingLog logs={tradeLogs} isTrading={isTrading} cleanLog={cleanTradeLog}/>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-light text-sm">
          <p>由 MiniMax Agent 构建 | 使用时请遵守相关法律法规</p>
        </div>
      </div>
    </div>
  );
}

export default App;