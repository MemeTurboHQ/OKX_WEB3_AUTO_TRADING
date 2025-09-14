import React, { useState, useEffect } from 'react';
import { SolanaService } from '../services/solanaService';

interface TradingControlProps {
  solanaService: SolanaService;
  onTradingStatusChange: (isTrading: boolean) => void;
  onTradeLog: (log: any) => void;
}

export const TradingControl: React.FC<TradingControlProps> = ({ 
  solanaService, 
  onTradingStatusChange, 
  onTradeLog 
}) => {
  const [status, setStatus] = useState(solanaService.getStatus());
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(solanaService.getStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, [solanaService]);

  const handleStartTrading = async () => {
    if (status.walletsCount === 0) {
      alert('请先导入钱包');
      return;
    }

    if (status.tokensCount === 0) {
      alert('请先导入代币地址');
      return;
    }

    setIsStarting(true);
    try {
      const success = solanaService.startTrading(onTradeLog);
      if (success) {
        onTradingStatusChange(true);
      }
    } catch (error) {
      console.error('启动交易失败:', error);
    } finally {
      setIsStarting(false);
    }
  };

  const handleStopTrading = async () => {
    setIsStopping(true);
    try {
      solanaService.stopTrading();
      onTradingStatusChange(false);
    } catch (error) {
      console.error('停止交易失败:', error);
    } finally {
      setIsStopping(false);
    }
  };

  const canStartTrading = status.walletsCount > 0 && status.tokensCount > 0 && !status.isTrading;
  const canStopTrading = status.isTrading;

  return (
    <div className="neumorphism-raised p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full animate-pulse ${
          status.isTrading ? 'bg-green-500' : 'bg-gray'
        }`}></div>
        交易控制
      </h2>
      
      <div className="space-y-4">
        {/* 状态显示 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="neumorphism p-4 text-center">
            <div className="text-2xl font-bold text-red-light">{status.walletsCount}</div>
            <div className="text-sm text-gray-light">钱包数量</div>
          </div>
          <div className="neumorphism p-4 text-center">
            <div className="text-2xl font-bold text-pink-light">{status.tokensCount}</div>
            <div className="text-sm text-gray-light">代币数量</div>
          </div>
          <div className="neumorphism p-4 text-center">
            <div className={`text-2xl font-bold ${
              status.isTrading ? 'text-green-400' : 'text-gray'
            }`}>
              {status.isTrading ? '运行中' : '已停止'}
            </div>
            <div className="text-sm text-gray-light">交易状态</div>
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="flex gap-4">
          <button
            onClick={handleStartTrading}
            disabled={!canStartTrading || isStarting}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium py-4 px-6 rounded-lg btn-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 animate-glow-pulse"
          >
            {isStarting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                启动中...
              </div>
            ) : (
              '开始刷单'
            )}
          </button>
          
          <button
            onClick={handleStopTrading}
            disabled={!canStopTrading || isStopping}
            className="flex-1 bg-gradient-to-r from-red-dark to-red hover:from-red hover:to-red-light text-white font-medium py-4 px-6 rounded-lg btn-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 glow-red"
          >
            {isStopping ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                停止中...
              </div>
            ) : (
              '停止刷单'
            )}
          </button>
        </div>

        {/* 钱包列表 */}
        {status.wallets.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-light mb-2">已导入的钱包:</h3>
            <div className="neumorphism p-3 max-h-32 overflow-y-auto">
              <div className="space-y-1">
                {status.wallets.map((wallet, index) => (
                  <div key={index} className="flex justify-between items-center text-xs">
                    <span className="text-gray-light font-mono">{wallet.publicKey}</span>
                    <span className="text-green-400">{wallet.balance.toFixed(4)} SOL</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 提示信息 */}
        {status.walletsCount === 0 && (
          <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-3">
            <div className="text-yellow-400 text-sm">⚠️ 请先在上方导入Solana钱包私钥</div>
          </div>
        )}
        
        {status.tokensCount === 0 && status.walletsCount > 0 && (
          <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-3">
            <div className="text-yellow-400 text-sm">⚠️ 请先在上方导入代币地址</div>
          </div>
        )}
      </div>
    </div>
  );
};