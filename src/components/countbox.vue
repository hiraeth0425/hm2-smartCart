<template>
  <div class="countbox">
    <button @click="subFn" class="subBtn">-</button>
    <input @change="handleChange" type="text" :value='value' class="inp">
    <button @click="addFn" class="addBtn">+</button>
  </div>
</template>

<script>
export default {
  name: 'CountBox',
  props: {
    value: {
      type: Number,
      default: 1
    }
  },
  methods: {
    subFn () {
      if (this.value <= 1) return
      this.$emit('input', this.value - 1)
    },
    addFn () {
      this.$emit('input', this.value + 1)
    },
    handleChange (e) {
    //   console.log(e.target.value)
      const num = +e.target.value
      if (isNaN(num) || num < 1) {
        e.target.value = this.value
        return
      }
      this.$emit('input', num)
    }
  }
}
</script>

<style scoped lang=less>
.countbox{
    display: flex;
    width: 110px;
    height: 30px;
    /* background-color: #f5f5f5; */
    button {
        width: 30px;
        height: 30px;
        background-color: #f5f5f5;
        outline: none;
        border: none;
    }
    input {
        margin: 0 5px;
        width: 40px;
        height: 30px;
        text-align: center;
        background-color: #f5f5f5;
        outline: none;
        border: none;
    }
}
</style>
