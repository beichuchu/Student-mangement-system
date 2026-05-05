# 学生管理系统

一个基于 React + Ant Design + Node.js + MongoDB 构建的完整学生信息管理平台。

## 功能特性

- ✅ 学生列表展示（表格形式，支持排序）
- ✅ 添加学生（表单验证）
- ✅ 编辑学生信息
- ✅ 删除学生（二次确认）
- ✅ 搜索功能（按姓名或学号模糊搜索）
- ✅ 筛选功能（按班级、性别筛选）
- ✅ 数据统计（总人数、男女比例、班级分布）
- ✅ 分页功能
- ✅ 数据持久化（MongoDB 数据库）

## 技术栈

### 前端
- React 18
- Ant Design 5
- Vite
- CSS3

### 后端
- Node.js
- Express
- MongoDB
- Mongoose

## 项目结构

```
student-management/
├── student-management/          # 前端项目
│   ├── src/
│   │   ├── App.jsx             # 主应用组件
│   │   ├── main.jsx            # 入口文件
│   │   └── index.css           # 全局样式
│   ├── index.html              # HTML模板
│   ├── package.json            # 前端配置
│   └── vite.config.js          # Vite配置
├── student-management-backend/  # 后端项目
│   ├── models/
│   │   └── Student.js          # 学生数据模型
│   ├── routes/
│   │   └── students.js         # API路由
│   ├── server.js               # 服务器入口
│   ├── package.json            # 后端配置
│   └── .env                    # 环境变量
├── SPEC.md                     # 项目规格说明书
└── README.md                   # 项目说明
```

## 安装与运行

### 前置要求
- Node.js >= 18.0.0
- MongoDB >= 4.0.0

### 1. 启动 MongoDB
```bash
# Windows (使用 MongoDB Compass 或命令行)
mongod --dbpath "C:\data\db"

# macOS/Linux
brew services start mongodb-community
```

### 2. 启动后端服务
```bash
cd student-management-backend
npm install
npm run dev
```
后端服务运行在: http://localhost:5000

### 3. 启动前端开发服务器
```bash
cd student-management
npm install
npm run dev
```
前端运行在: http://localhost:5173

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/students | 获取学生列表（支持分页、搜索、筛选） |
| GET | /api/students/:id | 获取单个学生 |
| POST | /api/students | 添加新学生 |
| PUT | /api/students/:id | 更新学生信息 |
| DELETE | /api/students/:id | 删除学生 |
| GET | /api/students/stats/summary | 获取统计数据 |
| GET | /api/students/classes/list | 获取班级列表 |

## 数据模型

```javascript
{
  studentId: String,    // 学号（唯一）
  name: String,         // 姓名
  gender: '男' | '女',  // 性别
  age: Number,          // 年龄（18-25）
  className: String,    // 班级
  phone: String,        // 联系电话（11位手机号）
  createdAt: Date,      // 创建时间
  updatedAt: Date       // 更新时间
}
```

## 表单验证规则

| 字段 | 验证规则 |
|------|----------|
| 学号 | 必填，4-10位字母或数字，唯一性检查 |
| 姓名 | 必填，2-20个字符 |
| 性别 | 必填 |
| 年龄 | 必填，18-25岁 |
| 班级 | 必填 |
| 联系电话 | 必填，11位手机号 |

## 使用说明

1. **查看学生列表**：首页展示所有学生信息
2. **添加学生**：点击右上角"添加学生"按钮
3. **编辑学生**：点击学生行的"编辑"按钮
4. **删除学生**：点击学生行的"删除"按钮（需二次确认）
5. **搜索学生**：在搜索框输入姓名或学号
6. **筛选学生**：选择班级或性别进行筛选

## 注意事项

- 确保 MongoDB 服务已启动
- 后端服务默认运行在 5000 端口
- 前端服务默认运行在 5173 端口
- 首次运行时数据库为空，需手动添加学生数据
