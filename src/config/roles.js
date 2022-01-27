  // role
  const roleObj = {
    id: 'admin',
    name: '管理员',
    describe: '拥有所有权限',
    status: 1,
    creatorId: 'system',
    createTime: 1497160610259,
    deleted: 0,
    permissions: [
      {
        roleId: 'admin',
        permissionId: 'dashboard',
        permissionName: '仪表盘'
      },
      {
        roleId: 'admin',
        permissionId: 'result',
        permissionName: '结果权限'
      },
      {
        roleId: 'admin',
        permissionId: 'profile',
        permissionName: '详细页权限',
      },
      {
        roleId: 'admin',
        permissionId: 'table',
        permissionName: '表格权限'
      },
      {
        roleId: 'admin',
        permissionId: 'form',
        permissionName: '表单权限'
      },
      {
        roleId: 'admin',
        permissionId: 'order',
        permissionName: '订单管理'
      },
      {
        roleId: 'admin',
        permissionId: 'permission',
        permissionName: '权限管理'
      },
      {
        roleId: 'admin',
        permissionId: 'role',
        permissionName: '角色管理'
      },
      {
        roleId: 'admin',
        permissionId: 'table',
        permissionName: '桌子管理'
      },
      {
        roleId: 'admin',
        permissionId: 'user',
        permissionName: '用户管理'
      },
      {
        roleId: 'admin',
        permissionId: 'other1',
        permissionName: '其他模块11'
      }
    ]
  }

  roleObj.permissions.push({
    roleId: 'admin',
    permissionId: 'support',
    permissionName: '超级模块'
  })

export default roleObj