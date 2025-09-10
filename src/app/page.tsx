'use client';

import { useState } from 'react';
import { Plus, Moon, Sun, Calendar, CheckCircle, Clock, Search } from 'lucide-react';
import { useTodos } from '@/hooks/useTodos';

export default function TodoApp() {
  const [darkMode, setDarkMode] = useState(false);
  const [newTodoText, setNewTodoText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { 
    todos, 
    filter, 
    setFilter, 
    addTodo, 
    updateTodo, 
    deleteTodo, 
    toggleTodoStatus, 
    stats, 
    isLoading 
  } = useTodos();

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      addTodo(newTodoText.trim());
      setNewTodoText('');
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilter({ ...filter, search: value });
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'todo': return <div className="w-5 h-5 border-2 border-violet-300 rounded-full" />;
      case 'progress': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'done': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      default: return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'todo': return 'border-violet-200 bg-violet-50 dark:bg-violet-900/20 dark:border-violet-800';
      case 'progress': return 'border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800';
      case 'done': return 'border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800';
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  const filterOptions = [
    { id: 'all', label: 'Todas', count: stats.total },
    { id: 'todo', label: 'Por Hacer', count: stats.pending },
    { id: 'progress', label: 'En Progreso', count: stats.inProgress },
    { id: 'done', label: 'Completadas', count: stats.completed },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto p-6">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              TaskFlow Todos
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Organiza tus tareas con estilo
            </p>
          </div>
          
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">{stats.inProgress}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">En Progreso</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completadas</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-2xl font-bold text-violet-600">{stats.pending}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pendientes</p>
            </div>
          </div>
        </div>

        {/* Add Task */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
          <form onSubmit={handleAddTodo} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Añadir nueva tarea..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button type="submit" className="btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Añadir
            </button>
          </form>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
          {/* Search */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar tareas..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
          
          {/* Filter Tabs */}
<div className="p-4 md:p-6 pb-0">
  {/* Mobile: Dropdown */}
  <div className="md:hidden mb-4">
    <select
      value={filter.status}
      onChange={(e) => setFilter({ ...filter, status: e.target.value as any })}
      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
    >
      {filterOptions.map((option) => (
        <option key={option.id} value={option.id}>
          {option.label} ({option.count})
        </option>
      ))}
    </select>
  </div>
  
  {/* Desktop: Tabs */}
  <div className="hidden md:flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
    {filterOptions.map((option) => (
      <button
        key={option.id}
        onClick={() => setFilter({ ...filter, status: option.id as any })}
        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium rounded-md transition-all ${
          filter.status === option.id 
            ? 'bg-white dark:bg-gray-800 text-violet-600 shadow-sm' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
      >
        {option.label}
        <span className="bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full text-xs">
          {option.count}
        </span>
      </button>
    ))}
  </div>
</div>
          
          {/* Todo List */}
          <div className="p-6">
            <div className="space-y-3">
              {todos.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium mb-1">¡Todo listo!</p>
                  <p className="text-sm">No hay tareas en esta categoría</p>
                </div>
              ) : (
                todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`group p-3 md:p-4 rounded-lg border cursor-move hover:shadow-md hover:border-violet-300 dark:hover:border-violet-600 transition-all duration-200 ${getStatusColor(todo.status)}`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Status Button */}
                      <button 
                        onClick={() => toggleTodoStatus(todo.id)}
                        className="flex-shrink-0 hover:scale-110 transition-transform mt-0.5"
                      >
                        {getStatusIcon(todo.status)}
                      </button>
                      
                      {/* Task Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-gray-900 dark:text-white font-medium text-sm md:text-base leading-relaxed ${
                            todo.status === 'done' ? 'line-through opacity-60' : ''
                          }`}>
                            {todo.text}
                          </p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getPriorityColor(todo.priority)}`}>
                            {todo.priority}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="w-3 md:w-4 h-3 md:h-4" />
                            <span>{todo.createdAt.toLocaleDateString()}</span>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => deleteTodo(todo.id)}
                              className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}