const { body } = require("express-validator/check");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.registerValidators = [
    body("email")
        .isEmail()
        .withMessage("Введите корректный email")
        .custom(async (value, req) => {
            try {
                const user = await User.findOne({ email: value });
                if (user) {
                    return Promise.reject("Такой email уже занят");
                }
            } catch (e) {
                console.log(e);
            }
        })
        .normalizeEmail(),
    body("password", "Пароль должен быть минимум из 6 символов")
        .isLength({ min: 6, max: 56 })
        .isAlphanumeric()
        .trim(),
    body("confirm")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Пароли должны совпадать");
            }
            return true;
        })
        .trim(),
    body("name")
        .isLength({ min: 3 })
        .withMessage("Имя должно состоять минимум из 3 символов")
        .trim(),
];

exports.loginValidators = [
    body("email")
        .isEmail()
        .withMessage("Такого пользователя не существует")
        .normalizeEmail(),
    body("password", "Пароль должен состоять минимум из 6 символов")
        .isLength({ min: 6, max: 56 })
        .isAlphanumeric()
        .trim(),
];

exports.courseValidate = [
    body("title")
        .isLength({ min: 3 })
        .withMessage("Минимальная длина названия 3 символа")
        .trim(),
    body("price").isNumeric().withMessage("Введите корректную цену"),
    body("img", "Введите корректный URL картинки").isURL(),
];
