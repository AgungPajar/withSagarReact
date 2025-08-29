import React from 'react'
import {motion} from "framer-motion"

const cardVariants = {
  hidden: {opacity: 0, y:20},
  visible: {opacity: 1, y:0}
}

export default function DashboardCard({title, children, className = ''}) {
  return (
    <motion.div 
      className={`bg-white p-6 rounded-2xl border border-gray-200/80 shadow-md ${className}`}
      variants={cardVariants}
      >
        {title && <h3 className='text-sm font-semibold text-gray-500 mb-4'>{title}</h3>}
        <div>
          {children}
        </div>
    </motion.div>
  )
} 