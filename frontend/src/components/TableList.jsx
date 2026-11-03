import React from 'react';

// Trazabilidad: Nielsen H6 (Reconocimiento antes que recuerdo), H8 (Estética) · Shneiderman S1, S2 · ISO 9241-11
export default function TableList({
  caption,
  columns = [],
  data = [],
  keyExtractor = (item, index) => item.id || index,
  loading = false,
  emptyMessage = 'No se encontraron registros.',
  renderMobileCard, // Optional custom card view for mobile viewports
}) {
  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="p-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
      >
        <span
          className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-sky-600 border-t-transparent mb-3"
          aria-hidden="true"
        />
        <p className="text-sm font-medium">Cargando información…</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        role="status"
        className="p-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
      >
        <p className="text-sm font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Vista móvil para pantallas pequeñas (menos de 640px / 320px) */}
      {renderMobileCard && (
        <div className="sm:hidden space-y-3">
          {data.map((item, index) => (
            <div
              key={keyExtractor(item, index)}
              className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              {renderMobileCard(item, index)}
            </div>
          ))}
        </div>
      )}

      {/* Tabla estándar (oculta en móvil si renderMobileCard está definido, o con scroll horizontal accesible) */}
      <div
        className={`${
          renderMobileCard ? 'hidden sm:block' : 'block'
        } overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm`}
        tabIndex={0}
        aria-label={caption}
      >
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
          {caption && (
            <caption className="sr-only">
              {caption}
            </caption>
          )}
          <thead className="bg-slate-50 dark:bg-slate-700/50 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={`px-4 py-3.5 ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {data.map((item, index) => (
              <tr
                key={keyExtractor(item, index)}
                className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors"
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={`px-4 py-3.5 align-middle ${col.className || ''}`}
                  >
                    {col.render ? col.render(item, index) : item[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
