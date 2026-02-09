import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { historyService } from '../services/api';

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await historyService.getHistory();
      setHistory(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to fetch history', error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'crop': return '🌾';
      case 'disease': return '🔬';
      case 'fertilizer': return '🧪';
      default: return '📝';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-amber-950 mb-8" style={{textShadow: '2px 2px 4px rgba(255,255,255,0.8), -1px -1px 2px rgba(255,255,255,0.6)'}}>
        {t('history.title')}
      </h1>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-xl text-gray-600">{t('history.noPredictions')}</p>
          <p className="text-gray-500 mt-2">
            {t('history.subtitle')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-3xl mr-3">{getIcon(item.type)}</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="ml-12">
                    {item.result && (
                      <div className="bg-green-50 p-3 rounded-lg mb-2">
                        <p className="text-sm font-semibold text-green-700">{t('history.result')}:</p>
                        <p className="text-gray-700">{item.result}</p>
                      </div>
                    )}
                    
                    {item.details && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-semibold text-gray-700">{t('history.details')}:</p>
                        <p className="text-gray-600 text-sm">{item.details}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
