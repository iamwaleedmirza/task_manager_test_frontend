<template>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <h4 class="mb-0">Tasks</h4>
      </div>

      <div class="card-body">
        <div class="row">
          <div class="col-md-12">
            <!-- Success Alert -->
            <div
                v-if="successMessage"
                class="alert alert-success alert-dismissible fade show"
                role="alert"
            >
              {{ successMessage }}
              <button
                  type="button"
                  class="btn-close"
                  @click="successMessage = ''"
                  aria-label="Close"
              ></button>
            </div>
            <table class="table table-bordered">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Task</th>
                <th scope="col">Due Date</th>
                <th scope="col">Priority</th>
                <th scope="col">Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="tasks.length===0">
                <td colspan="5" class="text-center">No Task Found</td>
              </tr>
              <tr v-for="(task , index) in tasks" :key="task.id">
                <td>{{ index + 1 }}</td>
                <td>{{ task.title }}</td>
                <td>{{ formatDate(task.due_date) }}</td>
                <td>{{ ucFirst(task.priority) }}</td>
                <td>
                  <!-- Edit Button -->
                  <router-link
                      :to="{ name: 'task.edit', params: { id: task.id }}"
                      class="btn btn-primary btn-sm me-2">
                    <i class="bi bi-pencil-square"></i>
                    Edit
                  </router-link>
                  <!-- Delete Button -->
                  <button
                      @click="deleteTask(task.id)"
                      class="btn btn-danger btn-sm">
                    <i class="bi bi-trash"></i>
                    Delete
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useTaskStore} from '@/stores/taskStore'
import {storeToRefs} from 'pinia'
import {onMounted} from "vue";

const taskStore = useTaskStore()
const {tasks} = storeToRefs(taskStore);
let successMessage = '';
onMounted(() => {
  taskStore.fetchTasks()
});

function deleteTask(taskId) {
  successMessage = ""

  if (confirm("Are you sure to delete the task?")) {
    taskStore.deleteTask(taskId);
    successMessage = "Task deleted successfully!"
  }
}

function formatDate(date) {
  const [year, month, day] = date.split('-').map(Number);
  const localDate = new Date(year, month - 1, day); // Month is 0-indexed

  return localDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function ucFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
</script>

<style scoped>

</style>