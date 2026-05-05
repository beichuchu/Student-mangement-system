import { useState, useEffect } from 'react'
import { Table, Button, Input, Select, Modal, Form, message, Popconfirm, Tag } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, UserOutlined, ManOutlined, WomanOutlined, TeamOutlined } from '@ant-design/icons'

const { Search } = Input
const { Option } = Select

const API_BASE_URL = 'http://localhost:5000/api'

function App() {
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState('')
  const [filterClass, setFilterClass] = useState('')
  const [filterGender, setFilterGender] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [classes, setClasses] = useState([])
  const [stats, setStats] = useState({ total: 0, maleCount: 0, femaleCount: 0 })

  useEffect(() => {
    loadStudents()
    loadClasses()
    loadStats()
  }, [])

  useEffect(() => {
    filterStudents()
  }, [searchText, filterClass, filterGender, students])

  const loadStudents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/students?page=${currentPage}&limit=${pageSize}`)
      const result = await response.json()
      if (result.success) {
        setStudents(result.data)
        setTotal(result.total)
      } else {
        message.error('加载学生数据失败')
      }
    } catch (error) {
      console.error('加载数据失败:', error)
      message.error('加载数据失败，请检查网络连接')
    }
  }

  const loadClasses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/students/classes/list`)
      const result = await response.json()
      if (result.success) {
        setClasses(result.data)
      }
    } catch (error) {
      console.error('加载班级列表失败:', error)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/students/stats/summary`)
      const result = await response.json()
      if (result.success) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('加载统计数据失败:', error)
    }
  }

  const filterStudents = () => {
    let result = [...students]

    if (searchText) {
      const lowerSearch = searchText.toLowerCase()
      result = result.filter(
        student =>
          student.name.toLowerCase().includes(lowerSearch) ||
          student.studentId.toLowerCase().includes(lowerSearch)
      )
    }

    if (filterClass) {
      result = result.filter(student => student.className === filterClass)
    }

    if (filterGender) {
      result = result.filter(student => student.gender === filterGender)
    }

    setFilteredStudents(result)
  }

  const handleAddStudent = () => {
    setEditingStudent(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEditStudent = (record) => {
    setEditingStudent(record)
    form.setFieldsValue({
      studentId: record.studentId,
      name: record.name,
      gender: record.gender,
      age: record.age,
      className: record.className,
      phone: record.phone
    })
    setIsModalVisible(true)
  }

  const handleDeleteStudent = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: 'DELETE'
      })
      const result = await response.json()
      if (result.success) {
        message.success('删除成功')
        loadStudents()
        loadStats()
      } else {
        message.error(result.message)
      }
    } catch (error) {
      message.error('删除失败，请重试')
    }
  }

  const handleModalOk = async () => {
    form.validateFields().then(async values => {
      try {
        if (editingStudent) {
          const response = await fetch(`${API_BASE_URL}/students/${editingStudent._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
          })
          const result = await response.json()
          if (result.success) {
            message.success('修改成功')
          } else {
            message.error(result.message)
            return
          }
        } else {
          const response = await fetch(`${API_BASE_URL}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
          })
          const result = await response.json()
          if (result.success) {
            message.success('添加成功')
          } else {
            message.error(result.message)
            return
          }
        }
        setIsModalVisible(false)
        form.resetFields()
        loadStudents()
        loadClasses()
        loadStats()
      } catch (error) {
        message.error('操作失败，请重试')
      }
    })
  }

  const handleModalCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  const validateStudentId = async (_, value) => {
    if (!value) {
      throw new Error('请输入学号')
    }
    if (!/^[a-zA-Z0-9]{4,10}$/.test(value)) {
      throw new Error('学号必须是4-10位字母或数字')
    }
    if (!editingStudent) {
      try {
        const response = await fetch(`${API_BASE_URL}/students?search=${value}`)
        const result = await response.json()
        if (result.success && result.total > 0) {
          throw new Error('该学号已存在')
        }
      } catch (error) {
        throw new Error('学号验证失败')
      }
    }
  }

  const validatePhone = async (_, value) => {
    if (!value) {
      throw new Error('请输入联系电话')
    }
    if (!/^1[3-9]\d{9}$/.test(value)) {
      throw new Error('请输入正确的11位手机号')
    }
  }

  const handleSearchChange = (value) => {
    setSearchText(value)
    setCurrentPage(1)
  }

  const handleClassChange = (value) => {
    setFilterClass(value || '')
    setCurrentPage(1)
  }

  const handleGenderChange = (value) => {
    setFilterGender(value || '')
    setCurrentPage(1)
  }

  const handlePageChange = (page, size) => {
    setCurrentPage(page)
    setPageSize(size)
    loadStudents()
  }

  const columns = [
    {
      title: '学号',
      dataIndex: 'studentId',
      key: 'studentId',
      width: 120,
      sorter: (a, b) => a.studentId.localeCompare(b.studentId)
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      render: (text, record) => {
        if (!searchText) return text
        const regex = new RegExp(`(${searchText})`, 'gi')
        const parts = text.split(regex)
        return parts.map((part, i) =>
          regex.test(part) ? <span key={i} className="highlight">{part}</span> : part
        )
      }
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
      render: (text) => (
        <Tag color={text === '男' ? 'blue' : 'red'} icon={text === '男' ? <ManOutlined /> : <WomanOutlined />}>
          {text}
        </Tag>
      )
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 80,
      sorter: (a, b) => a.age - b.age
    },
    {
      title: '班级',
      dataIndex: 'className',
      key: 'className',
      width: 150
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 130
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <div className="table-actions">
          <button className="edit-btn" onClick={() => handleEditStudent(record)}>
            <EditOutlined /> 编辑
          </button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这个学生吗？"
            onConfirm={() => handleDeleteStudent(record._id)}
            okText="确定"
            cancelText="取消"
          >
            <button className="delete-btn">
              <DeleteOutlined /> 删除
            </button>
          </Popconfirm>
        </div>
      )
    }
  ]

  return (
    <div className="app-container">
      <div className="header">
        <h1>🎓 学生管理系统</h1>
        <div className="header-actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddStudent}>
            添加学生
          </Button>
        </div>
      </div>

      <div className="main-content">
        <div className="statistics-cards">
          <div className="stat-card">
            <div className="stat-card-title">学生总人数</div>
            <div className="stat-card-value">{stats.total}</div>
            <UserOutlined className="stat-card-icon" style={{ color: '#1890ff' }} />
          </div>
          <div className="stat-card">
            <div className="stat-card-title">男生人数</div>
            <div className="stat-card-value">{stats.maleCount}</div>
            <ManOutlined className="stat-card-icon" style={{ color: '#1890ff' }} />
          </div>
          <div className="stat-card">
            <div className="stat-card-title">女生人数</div>
            <div className="stat-card-value">{stats.femaleCount}</div>
            <WomanOutlined className="stat-card-icon" style={{ color: '#ff4d4f' }} />
          </div>
          <div className="stat-card">
            <div className="stat-card-title">班级数量</div>
            <div className="stat-card-value">{classes.length}</div>
            <TeamOutlined className="stat-card-icon" style={{ color: '#52c41a' }} />
          </div>
        </div>

        <div className="search-filter-section">
          <div className="search-filter-form">
            <div className="search-item">
              <label style={{ display: 'block', marginBottom: 8, color: '#262626' }}>搜索学生</label>
              <Search
                placeholder="输入姓名或学号搜索"
                allowClear
                value={searchText}
                onChange={(e) => handleSearchChange(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </div>
            <div className="filter-item">
              <label style={{ display: 'block', marginBottom: 8, color: '#262626' }}>筛选班级</label>
              <Select
                placeholder="选择班级"
                allowClear
                style={{ width: '100%' }}
                value={filterClass || undefined}
                onChange={handleClassChange}
              >
                {classes.map(cls => (
                  <Option key={cls} value={cls}>{cls}</Option>
                ))}
              </Select>
            </div>
            <div className="filter-item">
              <label style={{ display: 'block', marginBottom: 8, color: '#262626' }}>筛选性别</label>
              <Select
                placeholder="选择性别"
                allowClear
                style={{ width: '100%' }}
                value={filterGender || undefined}
                onChange={handleGenderChange}
              >
                <Option value="男">男</Option>
                <Option value="女">女</Option>
              </Select>
            </div>
          </div>
        </div>

        <div className="table-section">
          <div className="table-title">学生信息列表</div>
          {filteredStudents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <div className="empty-state-text">暂无学生信息</div>
            </div>
          ) : (
            <Table
              className="student-table"
              columns={columns}
              dataSource={filteredStudents}
              rowKey="_id"
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
                pageSizeOptions: ['10', '20', '50'],
                onChange: handlePageChange
              }}
              scroll={{ x: 1000 }}
            />
          )}
        </div>
      </div>

      <div className="footer">
        <p>学生管理系统 © 2024 - 使用 React + Ant Design + Node.js + MongoDB 构建</p>
      </div>

      <Modal
        title={editingStudent ? '编辑学生信息' : '添加学生'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingStudent ? '保存' : '添加'}
        cancelText="取消"
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 20 }}
        >
          <Form.Item
            name="studentId"
            label="学号"
            rules={[{ required: true, validator: validateStudentId }]}
          >
            <Input placeholder="请输入4-10位学号" disabled={!!editingStudent} />
          </Form.Item>

          <Form.Item
            name="name"
            label="姓名"
            rules={[
              { required: true, message: '请输入姓名' },
              { min: 2, max: 20, message: '姓名长度为2-20个字符' }
            ]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            name="gender"
            label="性别"
            rules={[{ required: true, message: '请选择性别' }]}
          >
            <Select placeholder="请选择性别">
              <Option value="男">男</Option>
              <Option value="女">女</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="age"
            label="年龄"
            rules={[
              { required: true, message: '请输入年龄' },
              { type: 'number', min: 18, max: 25, message: '年龄必须在18-25岁之间' }
            ]}
          >
            <Input type="number" placeholder="请输入年龄（18-25岁）" min={18} max={25} />
          </Form.Item>

          <Form.Item
            name="className"
            label="班级"
            rules={[{ required: true, message: '请输入班级' }]}
          >
            <Input placeholder="请输入班级" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="联系电话"
            rules={[{ required: true, validator: validatePhone }]}
          >
            <Input placeholder="请输入11位手机号" maxLength={11} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default App
