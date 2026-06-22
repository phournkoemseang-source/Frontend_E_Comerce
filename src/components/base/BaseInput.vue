<script setup lang="ts">
import { useCssModule } from 'vue'

interface Props {
  modelValue: string | number
  label?: string
  placeholder?: string
  type?: string
  error?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false
})

const emit = defineEmits(['update:modelValue'])

const styles = useCssModule()
</script>

<template>
  <div :class="styles.wrapper">
    <label v-if="label" :class="styles.label">{{ label }}</label>
    <div :class="styles.inputContainer">
      <input 
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[styles.input, { [styles.hasError]: error }]"
      />
      <div v-if="$slots.suffix" :class="styles.suffix">
        <slot name="suffix" />
      </div>
    </div>
    <span v-if="error" :class="styles.errorText">{{ error }}</span>
  </div>
</template>

<style module>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--lumina-gray-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.inputContainer {
  position: relative;
  display: flex;
  align-items: center;
}

.input {
  width: 100%;
  padding: 0.875rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--lumina-gray-200);
  background-color: var(--lumina-gray-50);
  font-size: 0.9375rem;
  transition: all 0.2s;
  outline: none;
}

.input:focus {
  border-color: var(--lumina-black);
  background-color: var(--lumina-white);
  box-shadow: 0 0 0 2px rgba(0,0,0,0.05);
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hasError {
  border-color: #EF4444;
}

.suffix {
  position: absolute;
  right: 1rem;
  display: flex;
  align-items: center;
  color: var(--lumina-gray-500);
}

.errorText {
  font-size: 0.75rem;
  color: #EF4444;
}
</style>
