const UserModel = require('../models/userModel');

class UserController {
  static async index(req, res) {
    try {
      const users = await UserModel.findAll();

      return res.render('users/index', { users: users });
    } catch (error) {
      return res.status(500).render('error.ejs', { error });
    }
  }
  static async pratica(req, res) {
    try {

      const user = await UserModel.findById(id);

      res.render('users/show', { user: user });
    } catch (error) {
      return res.status(500).render('error.ejs', { error });
    }
  }
  static async pratico(req, res) {
    try {

      const user = await UserModel.findById(id);

      res.render('users/show', { user: user });
    } catch (error) {
      return res.status(500).render('error.ejs', { error });
    }
  }
  static async show(req, res) {
    try {
      const id = req.params.id;
      const user = await UserModel.findById(id);

      if (!user) {
        return res.status(404).render('404.ejs');
      }

      res.render('users/show', { user: user });
    } catch (error) {
      return res.status(500).render('error.ejs', { error });
    }
  }
  static async createForm(req, res) {
    res.render('users/create');
  }
  static async create(req, res) {
    try {
      const { name, username, birthDate, password, email, sex, status } = req.body;

      const user = new UserModel({
        name,
        username,
        birthDate,
        password,
        email,
        sex,
        status
      });

      console.log(user);

      const insertedUserId = await user.create();

      res.redirect(`/usuarios/exibir/${insertedUserId}`);
    } catch (error) {
      return res.status(500).render('error_cadastro.ejs', { error });
    }
  }
  static async editForm(req, res) {
    try {
      const id = req.params.id;
      const user = await UserModel.findById(id);

      if (!user) {
        return res.status(404).render('404.ejs');
      }

      if (user.birthDate) user.birthDate = new Date(user.birthDate).toISOString().split('T')[0];

      res.render('users/edit', { user: user });
    } catch (error) {
      return res.status(500).render('error.ejs', { error });
    }
  }
  static async edit(req, res) {
    try {
      const id = req.params.id;
      const { name, username, birthDate, password, email, sex, status } = req.body;

      const user = new UserModel({
        id,
        name,
        username,
        birthDate,
        password,
        email,
        sex,
        status
      });

      const result = await user.update();

      if (!result) {
        return res.status(404).render('404.ejs');
      }

      res.redirect(`/usuarios/exibir/${id}`);
    } catch (error) {
      return res.status(500).render('error.ejs', { error });
    }
  }
  static async deleteForm(req, res) {
    try {
      const id = req.params.id;
      const user = await UserModel.findById(id);

      if (!user) {
        return res.status(404).render('404.ejs');
      }

      res.render('users/delete', { user: user });
    } catch (error) {
      return res.status(500).render('error.ejs', { error });
    }
  }
  static async delete(req, res) {
    try {
      const id = req.params.id;

      const user = new UserModel({ id });

      const result = await user.delete();

      if (!result) {
        return res.status(404).render('404.ejs');
      }

      res.redirect('/create-user');
    } catch (error) {
      return res.status(500).render('error.ejs', { error });
    }
  }
}

module.exports = UserController;