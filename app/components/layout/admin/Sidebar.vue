<template>
  <aside class="sidebar">
    <h2 class="sidebar-title">Admin Panel</h2>
    <ul class="menu">
      <li><a href="/admin">Dashboard</a></li>
      <li><a href="/admin/user">Users</a></li>
      <li><a href="/admin/parts">Parts</a></li>
      <li><a href="/admin/settings">Settings</a></li>
    </ul>
  </aside>
</template>

<script setup>
// 사이드 메뉴에 필요한 추가 로직을 여기에 작성합니다.
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #343a40;
  color: #fff;
  padding: 1rem;
  z-index: 1000;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  overflow-y: auto;
}

.sidebar-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.menu {
  list-style: none;
  padding: 0;
}

.menu li {
  margin: 0.5rem 0;
}

.menu a {
  color: #fff;
  text-decoration: none;
}

.menu a:hover {
  text-decoration: underline;
}
</style>