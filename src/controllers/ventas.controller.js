import Ventas from'../models/ventas.js'

export const crearVenta = async (req, res) => {
    try {
        const nuevaVenta = new Ventas(req.body);
        const ventaGuardada = await nuevaVenta.save();
        res.status(201).json(ventaGuardada);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear la venta', error: error.message });
    }
};

// Función para obtener todas las ventas
export const obtenerVentas = async (req, res) => {
    try {
        const ventas = await Ventas.find().populate('servicio'). populate('cliente');
        res.status(200).json(ventas);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las ventas', error: error.message });
    }
};

// Función para obtener una venta por su ID
export const obtenerVentaPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const venta = await Ventas.findById(id).populate('servicio').populate('cliente');
        res.status(200).json(venta);
    } catch (error) {
        res.status(404).json({ mensaje: 'Venta no encontrada', error: error.message });
    }
};

// Función para actualizar una venta por su ID
export const actualizarVenta = async (req, res) => {
    const { id } = req.params;
    try {
        const ventaActualizada = await Ventas.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(ventaActualizada);
    } catch (error) {
        res.status(404).json({ mensaje: 'Venta no encontrada o error al actualizar', error: error.message });
    }
};

// Función para eliminar una venta por su ID
export const eliminarVenta = async (req, res) => {
    const { id } = req.params;
    try {
        await Ventas.findByIdAndDelete(id);
        res.status(204).json();
    } catch (error) {
        res.status(404).json({ mensaje: 'Venta no encontrada o error al eliminar', error: error.message });
    }
};

