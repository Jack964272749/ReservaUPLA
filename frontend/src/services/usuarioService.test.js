import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usuarioService } from './usuarioService';

describe('usuarioService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('crearPorAdmin envía solicitud POST a /usuarios/crear con todos los datos institucionales', async () => {
    const mockRespuesta = {
      id: 'usr-999',
      nombreCompleto: 'Ing. Marco Aurelio Torres',
      codigo: 'DOC-4921',
      correo: 'mtorres@upla.edu.pe',
      rol: 'Responsable',
      activo: true,
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      headers: {
        get: (h) => (h === 'content-type' ? 'application/json' : null),
      },
      json: async () => mockRespuesta,
    });

    const res = await usuarioService.crearPorAdmin({
      nombreCompleto: 'Ing. Marco Aurelio Torres',
      codigo: 'DOC-4921',
      correo: 'mtorres@upla.edu.pe',
      rol: 'Responsable',
      contrasena: 'ClaveSegura123*',
      activo: true,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/usuarios/crear'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          nombreCompleto: 'Ing. Marco Aurelio Torres',
          correo: 'mtorres@upla.edu.pe',
          rol: 'Responsable',
          contrasena: 'ClaveSegura123*',
          codigo: 'DOC-4921',
          activo: true,
        }),
      })
    );
    expect(res.exito).toBe(true);
    expect(res.datos.codigo).toBe('DOC-4921');
    expect(res.datos.activo).toBe(true);
  });

  it('actualizar envía solicitud PUT con id y datos en el cuerpo', async () => {
    const mockRespuesta = {
      id: 'usr-123',
      nombreCompleto: 'María Gómez',
      correo: 'maria@upla.edu.pe',
      rol: 'Responsable',
      activo: true,
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: {
        get: (h) => (h === 'content-type' ? 'application/json' : null),
      },
      json: async () => mockRespuesta,
    });

    const res = await usuarioService.actualizar('usr-123', {
      nombreCompleto: 'María Gómez',
      rol: 'Responsable',
      activo: true,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/usuarios/usr-123'),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({
          nombreCompleto: 'María Gómez',
          rol: 'Responsable',
          activo: true,
        }),
      })
    );
    expect(res.exito).toBe(true);
    expect(res.datos.rol).toBe('Responsable');
  });

  it('cambiarEstado envía solicitud PATCH con nuevo estado booleano', async () => {
    const mockRespuesta = {
      id: 'usr-123',
      activo: false,
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: {
        get: (h) => (h === 'content-type' ? 'application/json' : null),
      },
      json: async () => mockRespuesta,
    });

    const res = await usuarioService.cambiarEstado('usr-123', false);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/usuarios/usr-123/estado'),
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ activo: false }),
      })
    );
    expect(res.exito).toBe(true);
    expect(res.datos.activo).toBe(false);
  });
});
