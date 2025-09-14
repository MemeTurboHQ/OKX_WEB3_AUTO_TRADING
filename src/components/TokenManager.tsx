import React, { useState } from 'react';
import { SolanaService } from '../services/solanaService';

interface TokenManagerProps {
  solanaService: SolanaService;
  onTokensImported: () => void;
}

export const TokenManager: React.FC<TokenManagerProps> = ({ solanaService, onTokensImported }) => {
  const [tokenAddressesText, setTokenAddressesText] = useState('');
  const [importResult, setImportResult] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleImportTokens = async () => {
    if (!tokenAddressesText.trim()) {
      return;
    }

    setIsImporting(true);
    try {
      const result = solanaService.setTokenAddresses(tokenAddressesText);
      setImportResult(result);
      
      if (result.success > 0) {
        onTokensImported();
      }
    } catch (error) {
      console.error('导入代币失败:', error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleClearTokens = () => {
    setTokenAddressesText('');
    setImportResult(null);
  };

  return (
    <div className="neumorphism-raised p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <div className="w-2 h-2 bg-pink rounded-full animate-pulse"></div>
        代币管理
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-light mb-2">
            代币地址列表 (每行一个)
          </label>
          <textarea
            value={tokenAddressesText}
            onChange={(e) => setTokenAddressesText(e.target.value)}
            placeholder="请粘贴Solana代币地址，每行一个...
例如：
EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
9nDyrE8jgMb2H3m5zg1FQq4jfBhZQ2r3rWzLqJfXJzHt"
            className="w-full h-32 p-3 bg-dark-light border border-gray-dark rounded-lg text-white placeholder-gray resize-none focus:outline-none focus:ring-2 focus:ring-pink focus:border-transparent transition-all duration-300"
            disabled={isImporting}
          />
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleImportTokens}
            disabled={isImporting || !tokenAddressesText.trim()}
            className="flex-1 bg-gradient-to-r from-pink to-pink-light hover:from-pink-dark hover:to-pink text-white font-medium py-3 px-6 rounded-lg btn-hover disabled:opacity-50 disabled:cursor-not-allowed glow-pink"
          >
            {isImporting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                导入中...
              </div>
            ) : (
              '导入代币'
            )}
          </button>
          
          <button
            onClick={handleClearTokens}
            disabled={isImporting}
            className="bg-gray-dark hover:bg-gray text-white font-medium py-3 px-6 rounded-lg btn-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            清空
          </button>
        </div>
        
        {importResult && (
          <div className="mt-4 p-4 bg-dark-light border border-gray-dark rounded-lg">
            <div className="text-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-green-400">成功导入: {importResult.success} 个代币</span>
                {importResult.failed > 0 && (
                  <span className="text-red-light">失败: {importResult.failed} 个</span>
                )}
              </div>
              
              {importResult.errors.length > 0 && (
                <div className="mt-2">
                  <p className="text-red-light font-medium mb-1">错误详情:</p>
                  <ul className="text-xs text-gray-light space-y-1">
                    {importResult.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};