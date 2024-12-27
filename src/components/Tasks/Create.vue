<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h4 class="mb-0">Create New Task</h4>
          </div>

          <div class="card-body">
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
                  :disabled="isSubmitting"
              >
                <span
                    v-if="isSubmitting"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                ></span>
                {{ isSubmitting ? 'Creating...' : 'Create Task' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useTaskStore } from '@/stores/taskStore'
import { useRouter } from 'vue-router';

const router = useRouter();
// Form data state
const formData = reactive({
  title: '',
  priority: '',
  due_date: ''
});

// Form state
const errors = reactive({});
const isSubmitting = ref(false);
const successMessage = ref('');
const taskStore = useTaskStore()

// Computed minimum date (today)
const minDate = computed(() => {
  return new Date().toISOString().split('T')[0];
});

// Form validation
const validateForm = () => {
  //default error values
  errors.title = '';
  errors.priority = '';
  errors.due_date = '';
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
    const selectedDate = new Date(`${formData.due_date}T00:00:00`); // Add time to ensure local interpretation
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to midnight
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

  isSubmitting.value = true;
  successMessage.value = '';

  try {
    await taskStore.addTask(formData)  // Add a task
    setTimeout(() => {
      router.push({name: 'tasks'}); //redirecting to task list
    }, 1000)
    // Reset form
    Object.assign(formData, {
      title: '',
      priority: '',
      due_date: ''
    });

    // Show success message
    successMessage.value = 'Task created successfully!';

    // Emit event to parent
    emit('task-created');
  } catch (error) {
    if (error.response?.data?.errors) {
      Object.entries( error.response.data.errors).forEach(([index, value]) => {
        errors[index] = value[0];
      });
    } else {
      errors.general = 'An error occurred while creating the task';
      console.log(error)
    }
  } finally {
    isSubmitting.value = false;
  }
};

// Define emits
const emit = defineEmits(['task-created']);
</script>