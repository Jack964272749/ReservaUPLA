using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ReservaUPLA.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Ambientes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nombre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Tipo = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Capacidad = table.Column<int>(type: "integer", nullable: false),
                    Ubicacion = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Estado = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ambientes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    NombreCompleto = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Correo = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Rol = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Activo = table.Column<bool>(type: "boolean", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Reservas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Fecha = table.Column<DateOnly>(type: "date", nullable: false),
                    HoraInicio = table.Column<TimeSpan>(type: "interval", nullable: false),
                    HoraFin = table.Column<TimeSpan>(type: "interval", nullable: false),
                    Motivo = table.Column<string>(type: "text", nullable: false),
                    Estado = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    ObservacionAdmin = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    FechaRegistro = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UsuarioId = table.Column<Guid>(type: "uuid", nullable: false),
                    AmbienteId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reservas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reservas_Ambientes_AmbienteId",
                        column: x => x.AmbienteId,
                        principalTable: "Ambientes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Reservas_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Ambientes",
                columns: new[] { "Id", "Capacidad", "Estado", "FechaCreacion", "Nombre", "Tipo", "Ubicacion" },
                values: new object[,]
                {
                    { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), 35, "Disponible", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Laboratorio de Cómputo 101", "Laboratorio de Cómputo", "Pabellón B - Segundo Piso" },
                    { new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), 150, "Disponible", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Auditorio Central Magno", "Auditorio", "Edificio Administrativo - Planta Baja" },
                    { new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 18, "Disponible", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Sala de Reuniones del Consejo", "Sala de Reuniones", "Pabellón A - Tercer Piso" },
                    { new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), 25, "Disponible", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Laboratorio Especializado de Robótica", "Laboratorio Especializado", "Pabellón C - Primer Piso" }
                });

            migrationBuilder.InsertData(
                table: "Usuarios",
                columns: new[] { "Id", "Activo", "Correo", "FechaCreacion", "NombreCompleto", "Rol" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), true, "admin@upla.edu.pe", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Administrador General", "Administrador" },
                    { new Guid("22222222-2222-2222-2222-222222222222"), true, "jperez@upla.edu.pe", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Juan Pérez Docente", "Solicitante" },
                    { new Guid("33333333-3333-3333-3333-333333333333"), true, "mgomez@upla.edu.pe", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), "María Gómez Encargada", "Responsable de ambiente" }
                });

            migrationBuilder.InsertData(
                table: "Reservas",
                columns: new[] { "Id", "AmbienteId", "Estado", "Fecha", "FechaRegistro", "HoraFin", "HoraInicio", "Motivo", "ObservacionAdmin", "UsuarioId" },
                values: new object[,]
                {
                    { new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"), new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), "Aprobada", new DateOnly(2026, 11, 10), new DateTime(2026, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), new TimeSpan(0, 10, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), "Práctica calificada de Construcción de Software", "Aprobado por jefatura de laboratorio", new Guid("22222222-2222-2222-2222-222222222222") },
                    { new Guid("ffffffff-ffff-ffff-ffff-ffffffffffff"), new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), "Pendiente", new DateOnly(2026, 11, 12), new DateTime(2026, 11, 2, 0, 0, 0, 0, DateTimeKind.Utc), new TimeSpan(0, 17, 0, 0, 0), new TimeSpan(0, 14, 0, 0, 0), "Seminario de Inteligencia Artificial y Cloud", null, new Guid("22222222-2222-2222-2222-222222222222") }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Reservas_AmbienteId",
                table: "Reservas",
                column: "AmbienteId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservas_UsuarioId",
                table: "Reservas",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Correo",
                table: "Usuarios",
                column: "Correo",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Reservas");

            migrationBuilder.DropTable(
                name: "Ambientes");

            migrationBuilder.DropTable(
                name: "Usuarios");
        }
    }
}
