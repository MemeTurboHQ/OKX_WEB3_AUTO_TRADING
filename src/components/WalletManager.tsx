import React, { useState } from 'react';
import { SolanaService } from '../services/solanaService';

interface WalletManagerProps {
  solanaService: SolanaService;
  onWalletsImported: () => void;
}

export const WalletManager: React.FC<WalletManagerProps> = ({ solanaService, onWalletsImported }) => {
  const [privateKeysText, setPrivateKeysText] = useState('');
  const [importResult, setImportResult] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleImportWallets = async () => {
    if (!privateKeysText.trim()) {
      return;
    }

    setIsImporting(true);
    try {
      const result = solanaService.importPrivateKeys(privateKeysText);
      setImportResult(result);
      
      if (result.success > 0) {
        onWalletsImported();
      }
    } catch (error) {
      console.error('导入钱包失败:', error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleClearWallets = () => {
    setPrivateKeysText('');
    setImportResult(null);
  };

  return (
    <div className="neumorphism-raised p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <div className="w-2 h-2 bg-red rounded-full animate-pulse"></div>
        钱包管理
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-light mb-2">
            私钥列表 (Base58格式，每行一个)
          </label>
          <textarea
            value={privateKeysText}
            onChange={(e) => setPrivateKeysText(e.target.value)}
            placeholder="请粘贴Solana私钥，每行一个...
例如：
5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXp9d5VQ1h32\n3rJfvRp4YhQRV2wpqYfwG8YMJ3TyJbHgPaUDyoU91s12...."
            className="w-full h-32 p-3 bg-dark-light border border-gray-dark rounded-lg text-white placeholder-gray resize-none focus:outline-none focus:ring-2 focus:ring-red focus:border-transparent transition-all duration-300"
            disabled={isImporting}
          />
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleImportWallets}
            disabled={isImporting || !privateKeysText.trim()}
            className="flex-1 bg-gradient-to-r from-red to-red-light hover:from-red-dark hover:to-red text-white font-medium py-3 px-6 rounded-lg btn-hover disabled:opacity-50 disabled:cursor-not-allowed glow-red"
          >
            {isImporting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                导入中...
              </div>
            ) : (
              '导入钱包'
            )}
          </button>
          
          <button
            onClick={handleClearWallets}
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
                <span className="text-green-400">成功导入: {importResult.success} 个钱包</span>
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