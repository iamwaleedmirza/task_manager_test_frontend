<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h4 class="mb-0">Update Task</h4>
          </div>
          <div v-if="loading">Loading.....</div>
          <div class="card-body" v-else>
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

            <!-- Error Alert -->
            <div
                v-if="errors.general"
                class="alert alert-danger alert-dismissible fade show"
                role="alert"
            >
              {{ errors.general }}
              <button
                  type="button"
                  class="btn-close"
                  @click="errors.general = ''"
                  aria-label="Close"
              ></button>
            </div>

            <form @submit.prevent="submitTask">
              <!-- Title Input -->
              <div class="mb-3">
                <label for="title" class="form-label">Title</label>
                <input
                    id="title"
                    v-model="formData.title"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.title }"
                    placeholder="Enter task title"
                >
                <div class="invalid-feedback">{{ errors.title }}</div>
              </div>

              <!-- Priority Dropdown -->
              <div class="mb-3">
                <label for="priority" class="form-label">Priority</label>
                <select
                    id="priority"
                    v-model="formData.priority"
                    class="form-select"
                    :class="{ 'is-invalid': errors.priority }"
                >
                  <option value="">Select Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <div class="invalid-feedback">{{ errors.priority }}</div>
              </div>

              <!-- Due Date -->
              <div class="mb-3">
                <label for="due_date" class="form-label">Due Date</label>
                <input
                    id="due_date"
                    v-model="formData.due_date"
                    type="date"
                    class="form-control"
                    :class="{ 'is-invalid': errors.due_date }"
                    :min="minDate"
                >
                <div class="invalid-feedback">{{ errors.due_date }}</div>
              </div>

              <!-- Submit Button -->
              <button
                  type="submit"
                  class="btn btn-primary w-100"
                  :disabled="isUpdating"
              >
                <span
                    v-if="isUpdating"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                ></span>
                {{ isUpdating ? 'Updating...' : 'Update Task' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, computed, onMounted} from 'vue';
import {useTaskStore} from '@/stores/taskStore'
import {useRouter} from 'vue-router';
import axios from "axios";
import env from "../../../config/environment.js";

const router = useRouter();
let props = defineProps(['id'])
const taskStore = useTaskStore()
let task = ref({});
let loading = ref(true);
let formData = reactive({
  id: '',
  title: '',
  priority: '',
  due_date: ''
});
onMounted(() => {
  fetchTask(props.id);
});
const fetchTask = async (taskId) => {
  try {
    loading.value = true;
    const response = await axios.get(env.getApiUrl(`tasks/${taskId}`))
    task.value = response.data
    loading.value = false;
    Object.assign(formData, {
      id: task.value.id,
      title: task.value.title,
      priority: task.value.priority,
      due_date: task.value.due_date
    });
  } catch (err) {
    console.error('Error fetching tasks:', err)
  }
}
// Form data state

console.log("formData", formData);


// Form state
const errors = reactive({});
const isUpdating = ref(false);
const successMessage = ref('');

// Computed minimum date (today)
const minDate = computed(() => {
  return new Date().toISOString().split('T')[0];
});

// Form validation
const validateForm = () => {
  errors.value = {};
  let isValid = true;

  // Title validation
  if (!formData.title.trim()) {
    errors.title = 'Title is required';
    isValid = false;
  }

  // Priority validation
  if (!formData.priority) {
    errors.priority = 'Please select a priority level';
    isValid = false;
  }

  // Due date validation
  if (!formData.due_date) {
    errors.due_date = 'Due date is required';
    isValid = false;
  } else {
    const selectedDate = new Date(formData.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      errors.due_date = 'Due date cannot be in the past';
      isValid = false;
    }
  }

  return isValid;
};

// Form submission
const submitTask = async () => {
  if (!validateForm()) {
    return;
  }

  isUpdating.value = true;
  successMessage.value = '';

  try {
    await taskStore.updateTask(props.id, formData)  // Add a task

    // Reset form
    Object.assign(formData, {
      title: '',
      priority: '',
      due_date: ''
    });

    // Show success message
    successMessage.value = 'Task updated successfully!';
    setTimeout(() => {
      router.push({name: 'tasks'});

    }, 1000)
    // Emit event to parent
    emit('task-created');
  } catch (error) {
    if (error.response?.data?.errors) {
      Object.assign(errors, error.response.data.errors);
    } else {
      errors.general = 'An error occurred while creating the task';
      console.log(error)
    }
  } finally {
    isUpdating.value = false;
  }
};

// Define emits
const emit = defineEmits(['task-created']);
</script>