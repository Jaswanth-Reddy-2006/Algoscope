import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

interface Props {
    children?: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo)
    }

    private handleReset = () => {
        this.setState({ hasError: false })
        window.location.href = '/'
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback

            return (
                <div className="w-full h-full min-h-[400px] bg-background/50 flex items-center justify-center p-6 text-center backdrop-blur-sm">
                    <div className="max-w-md w-full glass-panel p-8 border-red-500/20 shadow-lg shadow-red-500/5">
                        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="text-red-500 w-6 h-6" />
                        </div>
                        <h1 className="text-lg font-bold mb-1">Visualization Error</h1>
                        <p className="text-white/40 text-[10px] mb-6 leading-relaxed">
                            Something went wrong while rendering this pattern.
                        </p>
                        <button
                            onClick={this.handleReset}
                            className="w-full h-10 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all border border-white/10"
                        >
                            <RotateCcw size={14} />
                            Reset View
                        </button>
                        <div className="mt-4 text-left p-2 bg-black/40 rounded border border-white/5 overflow-auto max-h-24 text-[8px] font-mono text-red-400">
                            {this.state.error?.toString()}
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
