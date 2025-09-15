import React, { useState } from 'react';
import { SolanaService } from '../services/solanaService';

interface VolManagerProps {
  solanaService: SolanaService;
  onVolChanged: (vol:number) => void;
}

export const VolManager: React.FC<VolManagerProps> = ({ solanaService, onVolChanged }) => {
  const [vol, setVol] = useState(0);
  const [importResult, setImportResult] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleVolChange = async (amount:number) => {
    if (!amount) {
      return;
    }
    setVol(amount)
    onVolChanged(amount);
  };

  const handleClearTokens = () => {
    setVol(0);
  };

  return (
    <div className="neumorphism-raised p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <div className="w-2 h-2 bg-pink rounded-full animate-pulse"></div>
        刷量管理
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-light mb-2">
            交易量
          </label>
          <textarea
            value={vol}
            onChange={(e:any)=>{handleVolChange(e.target.value)}} 
            placeholder="输入预计交易量大小 (以USD计算)"
            className="w-full h-16 p-3 bg-dark-light border border-gray-dark rounded-lg 
                      text-white placeholder-gray resize-none focus:outline-none 
                      focus:ring-2 focus:ring-pink focus:border-transparent 
                      transition-all duration-300 text-xl text-center"
            disabled={isImporting}
          />

        </div>
        
        <div className="flex gap-3 grid grid-cols-2 md:grid-cols-5 mb-6">
          <button
          onClick={()=>{handleVolChange(256)}}
            className="bg-gray-dark hover:bg-gray text-white font-medium py-3 px-6 rounded-lg btn-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            256 $
          </button>
          <button
          onClick={()=>{handleVolChange(512)}}
            className="bg-gray-dark hover:bg-gray text-white font-medium py-3 px-6 rounded-lg btn-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            512 $
          </button>
          <button
          onClick={()=>{handleVolChange(1024)}}
            className="bg-gray-dark hover:bg-gray text-white font-medium py-3 px-6 rounded-lg btn-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            1024 $
          </button>

          <button
          onClick={()=>{handleVolChange(2048)}}
            className="bg-gray-dark hover:bg-gray text-white font-medium py-3 px-6 rounded-lg btn-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            2048 $
          </button>

          <button
          onClick={()=>{handleVolChange(4096)}}
            className="bg-gray-dark hover:bg-gray text-white font-medium py-3 px-6 rounded-lg btn-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            4096 $
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