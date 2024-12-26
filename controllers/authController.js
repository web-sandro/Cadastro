const UserModel = require('../models/userModel');
const passwordService = require('../services/passwordService');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();
const bcrypt = require('bcrypt'); 

class AuthController {

    static loginForm(req, res) {
        res.render('auth/login');
    }
    static async login(req, res) {
        try {
            const { usernameOrEmail, password } = req.body;

            const user = await UserModel.findByUsernameOrEmail(usernameOrEmail);
            if (!user) {
                return res.render('auth/login', { errorMessage: 'Erro de autenticação.' });
            }

            const isValidPassword = await passwordService.comparePasswords(password, user.password);
            if (!isValidPassword) {
                return res.render('auth/login', { errorMessage: 'Senha incorreta.' });
            }

            req.session.user = user;
            return res.redirect('/');
        } catch (error) {
            console.error('Erro no login:', error);
            return res.status(500).render('error', { error });
        }
    }
    static logout(req, res) {
        try {
            req.session.destroy();
            return res.render('auth/logout');
        } catch (error) {
            console.log(error);
            return res.status(500).render('error.ejs', { error });
        }
    }
    static async forgotPassword(req, res) {
        try {
            const { email } = req.body;

            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.render('auth/forgot-password', { errorMessage: 'E-mail não encontrado.' });
               
            } 
    
            const token = crypto.randomBytes(20).toString('hex');
            const tokenExpiration = Date.now() + 3600000; 
            await UserModel.updatePasswordResetToken(user.id, token, tokenExpiration);
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
                port: process.env.EMAIL_PORT,
                tls: {
                    rejectUnauthorized: true,
                    minVersion: "TLSv1.2",
                },
            });

            // const transporter = nodemailer.createTransport({
            //     service: 'gmail',
            //     auth: {
            //         user: 'litoralnortesoftware@gmail.com',
            //         pass: 'vjrv xojd besf hwym',
            //     },
            //     port: '587',
            //     tls: {
            //         rejectUnauthorized: true,
            //         minVersion: 'TLSv1.2',
            //     },
            // });

            const mailOptions = {
                to: email,
                from: 'litoralnortesoftware@gmail.com',
                subject: 'Recuperação de Senha',
                text: `
                Você está recebendo este e-mail porque solicitou a redefinição de sua senha.
                Clique no link abaixo para redefinir sua senha:
                http://localhost:3000/autenticacao/reset-password?token=${token}
                `
            };
            await transporter.sendMail(mailOptions);
           res.send('E-mail enviado com instruções de recuperação!');
        } catch (error) {
            console.log('Erro Erro Erro ao enviar o e-mail: ', error);
            res.status(500).render('error.ejs', { error });
        }
    }
   static async resetPassword(req, res) {
    try {
        const { token, newPassword } = req.body;

        if (!newPassword || newPassword.trim() === "") {
            console.error('Erro na redefinição de senha:');
            return res.render('auth/reset-password', { errorMessage: 'A nova senha é obrigatória.', token });
        }

        const user = await UserModel.findByPasswordResetToken(token);
        if (!user || user.passwordResetExpires < Date.now()) {
            return res.render('auth/reset-password', { errorMessage: 'Token inválido ou expirado.', token });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await UserModel.updatePassword(user.id, hashedPassword);

        res.render('auth/login', { successMessage: 'Senha redefinida com sucesso!' });
    } catch (error) {
        console.error('Erro na redefinição de senha:', error);
        res.status(500).render('error', { error });
    }
    }
    static async createUser(req, res) {
        try {
          const { name, username, birthDate, password, email, sex, status, photo } = req.body;
      
          // Gerando o token de confirmação
          const token = crypto.randomBytes(32).toString('hex');
      
          // Criando o novo usuário com o token
          const user = new UserModel({
            name,
            username,
            birthDate,
            password,
            email,
            sex,
            status,
            photo,
            confirmationToken: token,
          });
      
          console.log(user);
      
          await AuthController.sendConfirmationEmail(email, token);
      
          // Redirecionando o usuário para a página de login
          res.send('Cadastro realizado! Verifique o email para confirmação.');
      
        } catch (error) {
          console.log(error);
          return res.status(500).render('error.ejs', { error });
        }
    }
    static async createUserForm(req, res) {
        res.render('auth/create');
    }
    // Função para ativar o usuário após confirmação
    static async activateUser(id) {
        const sql = `
            UPDATE user
            SET status = 'Ativado', confirmationToken = NULL
            WHERE id = ?
        `;
        const [result] = await pool.query(sql, [id]);
        return result.affectedRows > 0;
    }
     // Método para confirmar o registro do usuário
    static async confirmRegistration(req, res) {
        const { token } = req.params;

        if (!token) {
            return res.status(400).render('confirmar', { errorMessage: 'Token de verificação ausente.' });
        }

        try {
            const result = await UserModel.verifyEmail(token);
            if (result) {
                await UserModel.activateUser(result.id);
                res.render('confirmar', { message: 'E-mail verificado com sucesso!' });
            } else {
                res.render('confirmar', { errorMessage: 'Token de confirmação inválido ou expirado.' });
            }
        } catch (error) {
            console.error('Erro ao verificar o e-mail:', error);
            res.status(500).render('confirmar', { errorMessage: 'Erro ao verificar o e-mail.' });
        }
    }
     // Método para enviar o e-mail de confirmação
    static async sendConfirmationEmail(email, confirmationToken) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { 
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from:  process.env.EMAIL_USER,
        to: email, 
        subject: 'Confirmação de Cadastro',
        html: `
            <p>Por favor, confirme seu cadastro clicando no link abaixo:</p>
            <a href="http://localhost:3000/usuarios/cadastrar">Confirme seu Cadastro</a>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('E-mail de confirmação enviado.');
    } catch (error) {
        console.error('Erro ao enviar o e-mail de confirmação:', error);
        throw new Error('Erro ao enviar o e-mail de confirmação.');
    }
    }
}
module.exports = AuthController;