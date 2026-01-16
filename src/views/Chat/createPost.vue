<script setup lang="ts">
    import {ref,onMounted} from 'vue'
    import { QuillEditor } from '@vueup/vue-quill'
    import '@vueup/vue-quill/dist/vue-quill.snow.css'
    // interface Props {
    //     mode: 'create' | 'edit'
    //     PostId?: string
    // }
//     const modules = {
//   toolbar: [
//     ['bold', 'italic', 'underline'],
//     ['code-block'],
//     ['link', 'image']
//   ]
// } as any

    const title = ref('')
    const content = ref('')
    const loading = ref(false)
    //未编辑完继续编辑
</script>
<template> 
<div class="post-editor">
   <div id="toolbar" class="custom-toolbar"> <button class="ql-bold">B</button> <button class="ql-italic">I</button> <button class="ql-underline">U</button> <button class="ql-code-block">{ }</button> <button class="ql-image">🖼</button> <button class="ql-link">🔗</button> </div>
  <input
    v-model="title"
    placeholder="请输入文章标题（5~100个字）"
    class="title-input"
  />

  <QuillEditor
    v-model:content="content"
    content-type="html"
    theme="snow"
    toolbar="#toolbar"
    placeholder="请输入正文内容"
  />

  <button :disabled="loading">发布</button>
</div>

</template>
<style>
   .post-editor {
  display: flex;
  flex-direction: column;
  width: 1200px;
  background-color: #fff;
  padding: 20px 40px;
}

.ql-toolbar.ql-snow {
  border: none;
  border: 0;
  /* border-bottom: 1px solid #e5e6eb; */
}
.ql-container.ql-snow:focus,
.ql-container.ql-snow:invalid {
  outline: none !important;
  border: none !important;  /* 或你想要的正常边框 */
}

.ql-container.ql-snow {
  border: none;
  outline: 0;
  min-height: 400px;
}
.title-input{
    font-size: 25px;
    outline: none;
    border: none;
}
</style>