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
    solanaService.setAmount(String(amount))
    onVolChanged(amount);
  };

  const handleClearTokens = () => {
    setVol(0);
  };

  return (
    <div className="neumorphism-raised p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <div className="w-2 h-2 bg-pink rounded-full animate-pulse"></div>
        刷量大小
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-light mb-2">
            交易量管理
          </label>
          <textarea
            value={vol}
            onChange={(e:any)=>{handleVolChange(e.target.value)}} 
            placeholder="输入预计交易量百分比"
            className="w-full h-16 p-3 bg-dark-light border border-gray-dark rounded-lg 
                      text-white placeholder-gray resize-none focus:outline-none 
                      focus:ring-2 focus:ring-pink focus:border-transparent 
                      transition-all duration-300 text-xl text-center"
            disabled={isImporting}
          />

        </div>
        
        <div className="flex gap-3 grid grid-cols-2 md:grid-cols-4 mb-6">
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

        </div>
        
      </div>
    </div>
  );
};