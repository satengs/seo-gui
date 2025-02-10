import React, {useState} from 'react';

interface JsonViewerProps {
  data: any;
  level?: number;
  isExpanded?: boolean;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data, level = 0 }) => {
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});

  if (data === null) return <span className="text-gray-500">null</span>;
  if (typeof data !== 'object') {
    return (
      <span
        className={`${typeof data === 'string' ? 'text-green-600' : 'text-blue-600'}`}
      >
        {JSON.stringify(data)}
      </span>
    );
  }

  const isArray = Array.isArray(data);
  const isEmpty = Object.keys(data).length === 0;

  if (isEmpty) {
    return <span>{isArray ? '[]' : '{}'}</span>;
  }

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="font-mono">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="py-1">
          {typeof value === 'object' && value !== null ? (
            <div>
              <span
                onClick={() => toggleExpand(key)}
                className="text-purple-600 cursor-pointer hover:text-purple-800"
              >
                {isArray ? '' : `"${key}": `}
                {expandedKeys[key] ? (
                  <span className="text-gray-600">{isArray ? '[' : '{'}</span>
                ) : (
                  <span className="text-gray-400">
                    {isArray ? '[...]' : '{...}'}
                  </span>
                )}
              </span>
              {expandedKeys[key] && (
                <div className="ml-4">
                  <JsonViewer
                    data={value}
                    level={level + 1}
                    // isExpanded={false}
                  />
                  <div className="text-gray-600">{isArray ? ']' : '}'}</div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <span className="text-purple-600">
                {isArray ? '' : `"${key}": `}
              </span>
              <JsonViewer data={value} level={level + 1} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default JsonViewer;
