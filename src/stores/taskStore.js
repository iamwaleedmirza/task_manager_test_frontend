import { defineStore } from 'pinia'
import axios from 'axios';
import env from '../../config/environment.js';

import { ref, computed } from 'vue'

export const useTaskStore = defineStore('tasks', () => {
    // State
    const tasks = ref([])
    let task = ref({})
    const loading = ref(false)
    const error = ref(null)

    // Getters
    const getTask = computed(() => task.value)
    const getTasks = computed(() => tasks.value)
    const isLoading = computed(() => loading.value)
    const hasError = computed(() => error.value !== null)

    // Actions
    const fetchTasks = async () => {
        loading.value = true
        error.value = null
        try {
            const response = await axios.get(env.getApiUrl('tasks'))
            tasks.value = response.data
        } catch (err) {
            error.value = err.message
            console.error('Error fetching tasks:', err)
        } finally {
            loading.value = false
        }
    }


    const addTask = async (task) => {
        try {
            const response = await axios.post(env.getApiUrl('tasks'), task)
            tasks.value.push(response.data)
            return response.data
        } catch (err) {
            error.value = err.message
            console.error('Error adding task:', err)
            throw err
        }
    }

    const updateTask = async (taskId, updates) => {
        try {
            const response = await axios.put(env.getApiUrl(`tasks/${taskId}`), updates)
            const index = tasks.value.findIndex(task => task.id === taskId)
            if (index !== -1) {
                tasks.value[index] = response.data
            }
            return response.data
        } catch (err) {
            error.value = err.message
            console.error('Error updating task:', err)
            throw err
        }
    }

    const deleteTask = async (taskId) => {
        try {
            await axios.delete(env.getApiUrl(`tasks/${taskId}`))
            tasks.value = tasks.value.filter(task => task.id !== taskId)
        } catch (err) {
            error.value = err.message
            console.error('Error deleting task:', err)
            throw err
        }
    }

    return {
        // State
        tasks,
        loading,
        error,
        // Getters
        getTasks,
       isLoading,
        hasError,
        // Actions
        fetchTasks,
        addTask,
        updateTask,
        deleteTask
    }
});