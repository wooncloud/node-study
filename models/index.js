const Sequelize = require('sequelize');
const User = require('./user');
const Comment = require('./comment');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);
db.sequelize = sequelize;

// db객체에 모델 담기
db.User = User;
db.Comment = Comment;

// 각각 모델의 static initiate 호출 => 모델 init이 실행되어야 테이블이 모델로 연결
User.initiate(sequelize);
Comment.initiate(sequelize);

// 다른 테이블과 관계를 연결
User.associate(db);
Comment.associate(db);

module.exports = db;