import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Home, ChevronRight } from 'lucide-react'

const NotFound: React.FC = () => {
    return (
        <div className="flex-1 flex items-center justify-center p-8 mesh-bg">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full text-center"
            >
                <div className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/20 shadow-glow-red">
                    <Search className="text-red-400 w-10 h-10" />
                </div>

                <h1 className="text-5xl font-bold mb-4 tracking-tight">404</h1>
                <h3 className="text-xl font-semibold mb-6 text-white/80">Requested Pattern Not Found</h3>

                <p className="text-white/40 mb-10 leading-relaxed font-light">
                    The logic pattern you're looking for doesn't exist in our current database or has been relocated to another sector.
                </p>

                <div className="flex flex-col gap-4">
                    <Link to="/problems" className="btn-primary justify-center py-4">
                        <Search size={18} />
                        <span>Browse Library</span>
                        <ChevronRight size={18} className="ml-auto" />
                    </Link>

                    <Link to="/" className="btn-secondary justify-center py-4">
                        <Home size={18} />
                        <span>Return Home</span>
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}

export default NotFound
