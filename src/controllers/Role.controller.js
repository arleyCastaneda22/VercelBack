import express from 'express';
import Role from '../models/Role.js'

export const createRole = async (req, res) => {
    try {
      const { nombre } = req.body;
  
      // Verifica si el rol ya existe
      const existingRole = await Role.findOne({ nombre });
      if (existingRole) {
        return res.status(400).json({ error: 'Este rol ya existe' });
      }
  
      // Crea el nuevo rol
      const role = new Role({ nombre });
      await role.save();
  
      res.status(201).json({ role });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Error de servidor' });
    }
  };