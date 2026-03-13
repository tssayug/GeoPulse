import React from 'react';
import { X, GripHorizontal, Maximize2 } from 'lucide-react';

export interface WidgetWrapperProps {
    id: string;
    title: string;
    onRemove?: (id: string) => void;
    children: React.ReactNode;
}

const WidgetWrapper: React.FC<WidgetWrapperProps> = ({ id, title, onRemove, children }) => {
    return (
        <div className="flex flex-col h-full w-full bg-dark-panel border border-dark-border rounded-lg shadow-lg overflow-hidden group">
            {/* Title Bar - Drag Handle */}
            <div className="drag-handle h-10 bg-dark-bg border-b border-dark-border flex items-center justify-between px-3 cursor-move cursor-grab active:cursor-grabbing select-none hover:bg-opacity-80 transition-colors">
                <div className="flex items-center gap-2">
                    <GripHorizontal size={14} className="text-gray-500 group-hover:text-dark-accent transition-colors" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">{title}</h3>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-dark-panel rounded text-gray-400 hover:text-gray-200 transition-colors cursor-pointer z-10" aria-label="Maximize">
                        <Maximize2 size={14} />
                    </button>
                    {onRemove && (
                        <button
                            onMouseDown={(e) => { e.stopPropagation(); onRemove(id); }}
                            className="p-1 hover:bg-dark-panel rounded text-gray-400 hover:text-dark-alert transition-colors cursor-pointer z-10"
                            aria-label="Close"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Widget Content */}
            <div className="flex-1 p-4 overflow-auto custom-scrollbar relative">
                {children}
            </div>
        </div>
    );
};

export default WidgetWrapper;
