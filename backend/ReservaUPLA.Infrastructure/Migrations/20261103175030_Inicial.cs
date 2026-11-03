using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReservaUPLA.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Inicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "usuarios",
                columns: table => new
                {
                    id_usuario = table.Column<Guid>(type: "uuid", nullable: false),
                    nom_usuario = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    cor_usuario = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    has_usuario = table.Column<string>(type: "text", nullable: false),
                    rol_usuario = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    act_usuario = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_usuarios", x => x.id_usuario);
                });

            migrationBuilder.CreateTable(
                name: "ambientes",
                columns: table => new
                {
                    id_ambiente = table.Column<Guid>(type: "uuid", nullable: false),
                    nom_ambiente = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    tip_ambiente = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    cap_ambiente = table.Column<int>(type: "integer", nullable: false),
                    ubi_ambiente = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    est_ambiente = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    idr_ambiente = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ambientes", x => x.id_ambiente);
                    table.ForeignKey(
                        name: "FK_ambientes_usuarios_idr_ambiente",
                        column: x => x.idr_ambiente,
                        principalTable: "usuarios",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "reservas",
                columns: table => new
                {
                    id_reserva = table.Column<Guid>(type: "uuid", nullable: false),
                    fec_reserva = table.Column<DateOnly>(type: "date", nullable: false),
                    hin_reserva = table.Column<TimeSpan>(type: "interval", nullable: false),
                    hfi_reserva = table.Column<TimeSpan>(type: "interval", nullable: false),
                    mot_reserva = table.Column<string>(type: "text", nullable: false),
                    est_reserva = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    idu_reserva = table.Column<Guid>(type: "uuid", nullable: false),
                    ida_reserva = table.Column<Guid>(type: "uuid", nullable: false),
                    fre_reserva = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_reservas", x => x.id_reserva);
                    table.ForeignKey(
                        name: "FK_reservas_ambientes_ida_reserva",
                        column: x => x.ida_reserva,
                        principalTable: "ambientes",
                        principalColumn: "id_ambiente",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_reservas_usuarios_idu_reserva",
                        column: x => x.idu_reserva,
                        principalTable: "usuarios",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ambientes_idr_ambiente",
                table: "ambientes",
                column: "idr_ambiente");

            migrationBuilder.CreateIndex(
                name: "IX_reservas_ida_reserva_fec_reserva_est_reserva",
                table: "reservas",
                columns: new[] { "ida_reserva", "fec_reserva", "est_reserva" });

            migrationBuilder.CreateIndex(
                name: "IX_reservas_idu_reserva",
                table: "reservas",
                column: "idu_reserva");

            migrationBuilder.CreateIndex(
                name: "IX_usuarios_cor_usuario",
                table: "usuarios",
                column: "cor_usuario",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "reservas");

            migrationBuilder.DropTable(
                name: "ambientes");

            migrationBuilder.DropTable(
                name: "usuarios");
        }
    }
}
