'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiTrash2, FiCheckCircle, FiCircle } from 'react-icons/fi'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [mounted, setMounted] = useState(false)

  // Load todos from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos))
      } catch (error) {
        console.error('Failed to load todos:', error)
      }
    }
  }, [])

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('todos', JSON.stringify(todos))
    }
  }, [todos, mounted])

  const addTodo = () => {
    if (input.trim() === '') return

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: input,
      completed: false,
      createdAt: Date.now(),
    }

    setTodos([newTodo, ...todos])
    setInput('')
  }

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed))
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const completedCount = todos.filter((todo) => todo.completed).length
  const activeCount = todos.length - completedCount

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-[#0f172a] to-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-accent to-purple-400 bg-clip-text text-transparent">
            My Tasks
          </h1>
          <p className="text-gray-400">Stay organized and productive</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm mb-1">Total</p>
            <p className="text-2xl font-bold text-white">{todos.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm mb-1">Active</p>
            <p className="text-2xl font-bold text-blue-400">{activeCount}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-400">{completedCount}</p>
          </div>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Add a new task..."
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addTodo}
              className="bg-accent hover:bg-blue-600 text-white rounded-lg px-6 py-3 font-semibold flex items-center gap-2 transition-colors"
            >
              <FiPlus /> Add
            </motion.button>
          </div>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-2 mb-6 flex-wrap"
        >
          {(['all', 'active', 'completed'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors capitalize ${
                filter === filterType
                  ? 'bg-accent text-white'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:border-accent/50'
              }`}
            >
              {filterType}
            </button>
          ))}
        </motion.div>

        {/* Todo List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          <AnimatePresence mode="popLayout">
            {filteredTodos.length > 0 ? (
              filteredTodos.map((todo) => (
                <motion.div
                  key={todo.id}
                  variants={itemVariants}
                  exit={{ opacity: 0, x: -100 }}
                  layout
                  className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center gap-3 hover:border-accent/50 transition-colors group"
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="text-2xl text-gray-400 hover:text-accent transition-colors flex-shrink-0"
                  >
                    {todo.completed ? (
                      <FiCheckCircle className="text-green-400" />
                    ) : (
                      <FiCircle />
                    )}
                  </button>
                  <span
                    className={`flex-1 text-lg ${
                      todo.completed
                        ? 'line-through text-gray-500'
                        : 'text-white'
                    }`}
                  >
                    {todo.text}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                  >
                    <FiTrash2 size={20} />
                  </motion.button>
                </motion.div>
              ))
            ) : (
              <motion.div
                variants={itemVariants}
                className="text-center py-12"
              >
                <p className="text-gray-500 text-lg">
                  {todos.length === 0
                    ? 'No tasks yet. Add one to get started!'
                    : `No ${filter} tasks.`}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Clear Completed Button */}
        {completedCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
          >
            <button
              onClick={clearCompleted}
              className="text-gray-400 hover:text-red-400 transition-colors text-sm underline"
            >
              Clear completed tasks
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
