--
-- PostgreSQL database dump
--

\restrict fWCWDcxEXytgmwPnFXf9CgOEkla59cPRb9pgm6Orfga01gFYLdaOuOzXlD2OAZV

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.reservas DROP CONSTRAINT IF EXISTS "FK_reservas_usuarios_idu_reserva";
ALTER TABLE IF EXISTS ONLY public.reservas DROP CONSTRAINT IF EXISTS "FK_reservas_ambientes_ida_reserva";
ALTER TABLE IF EXISTS ONLY public.ambientes DROP CONSTRAINT IF EXISTS "FK_ambientes_usuarios_idr_ambiente";
DROP INDEX IF EXISTS public."IX_usuarios_cor_usuario";
DROP INDEX IF EXISTS public."IX_reservas_idu_reserva";
DROP INDEX IF EXISTS public."IX_reservas_ida_reserva_fec_reserva_est_reserva";
DROP INDEX IF EXISTS public."IX_ambientes_idr_ambiente";
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS "PK_usuarios";
ALTER TABLE IF EXISTS ONLY public.reservas DROP CONSTRAINT IF EXISTS "PK_reservas";
ALTER TABLE IF EXISTS ONLY public.ambientes DROP CONSTRAINT IF EXISTS "PK_ambientes";
ALTER TABLE IF EXISTS ONLY public."__EFMigrationsHistory" DROP CONSTRAINT IF EXISTS "PK___EFMigrationsHistory";
DROP TABLE IF EXISTS public.usuarios;
DROP TABLE IF EXISTS public.reservas;
DROP TABLE IF EXISTS public.ambientes;
DROP TABLE IF EXISTS public."__EFMigrationsHistory";
-- *not* dropping schema, since initdb creates it
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __EFMigrationsHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL
);


ALTER TABLE public."__EFMigrationsHistory" OWNER TO postgres;

--
-- Name: ambientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ambientes (
    id_ambiente uuid NOT NULL,
    nom_ambiente character varying(100) NOT NULL,
    tip_ambiente character varying(50) NOT NULL,
    cap_ambiente integer NOT NULL,
    ubi_ambiente character varying(100) NOT NULL,
    est_ambiente character varying(30) NOT NULL,
    idr_ambiente uuid
);


ALTER TABLE public.ambientes OWNER TO postgres;

--
-- Name: reservas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservas (
    id_reserva uuid NOT NULL,
    fec_reserva date NOT NULL,
    hin_reserva interval NOT NULL,
    hfi_reserva interval NOT NULL,
    mot_reserva text NOT NULL,
    est_reserva character varying(30) NOT NULL,
    idu_reserva uuid NOT NULL,
    ida_reserva uuid NOT NULL,
    fre_reserva timestamp with time zone NOT NULL
);


ALTER TABLE public.reservas OWNER TO postgres;

--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id_usuario uuid NOT NULL,
    nom_usuario character varying(150) NOT NULL,
    cor_usuario character varying(150) NOT NULL,
    has_usuario text NOT NULL,
    rol_usuario character varying(50) NOT NULL,
    act_usuario boolean NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Data for Name: __EFMigrationsHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."__EFMigrationsHistory" VALUES ('20261103175030_Inicial', '8.0.4');


--
-- Data for Name: ambientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.ambientes VALUES ('1a7b795e-0617-49a8-8ed1-434e38e97b43', 'Laboratorio de Computo 101', 'LaboratorioComputo', 35, 'Pabellon B - 2do Piso', 'Disponible', '9967ec0c-27ee-4df6-ba3f-e04b3d2fb02f');
INSERT INTO public.ambientes VALUES ('49074fdc-a303-428d-bbf5-c68205dfbbae', 'Aula Magna de Medicina', 'Auditorio', 120, 'Pabellon de Ciencias de la Salud', 'Disponible', NULL);
INSERT INTO public.ambientes VALUES ('62b1ee86-76ba-4e06-aff6-ec6e09976975', 'Sala de Grados y Titulos', 'SalaReuniones', 45, 'Pabellon A - 3er Piso', 'Disponible', '74f70257-a1c8-4500-805e-1cc372862ba7');
INSERT INTO public.ambientes VALUES ('6aa842e9-bb8f-4c64-95b0-3903c3fae8bd', 'Laboratorio de Robotica e IA', 'LaboratorioEspecializado', 25, 'Pabellon C - 1er Piso', 'Disponible', '74f70257-a1c8-4500-805e-1cc372862ba7');
INSERT INTO public.ambientes VALUES ('a5e3b7b5-ba9f-49ee-a82f-cf919ce4c494', 'Taller de Prototipado y Realidad Virtual', 'LaboratorioEspecializado', 22, 'Pabellon C - 2do Piso', 'Disponible', '74f70257-a1c8-4500-805e-1cc372862ba7');
INSERT INTO public.ambientes VALUES ('df798811-8cbe-4392-bf19-2778267eed17', 'Auditorio Central Magno', 'Auditorio', 250, 'Edificio Administrativo - Planta Baja', 'Disponible', '9967ec0c-27ee-4df6-ba3f-e04b3d2fb02f');
INSERT INTO public.ambientes VALUES ('f61b2d25-b048-46f2-a48e-22a8e0a05dc2', 'Sala de Reuniones de Facultad', 'SalaReuniones', 18, 'Pabellon A - 2do Piso', 'Disponible', NULL);
INSERT INTO public.ambientes VALUES ('f6bad81d-b483-43f8-b925-c19d0a1f49f4', 'Laboratorio de Redes Cisco', 'LaboratorioComputo', 30, 'Pabellon B - 3er Piso', 'Disponible', '9967ec0c-27ee-4df6-ba3f-e04b3d2fb02f');


--
-- Data for Name: reservas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.reservas VALUES ('04fbf952-de28-4b7c-8e03-5b936f2903ea', '2026-11-04', '11:00:00', '13:00:00', 'Evaluacion Parcial de Conmutacion y Enrutamiento Cisco', 'Pendiente', 'c26cec3f-5ac6-460e-8a1a-90c4c039109c', 'f6bad81d-b483-43f8-b925-c19d0a1f49f4', '2026-11-03 16:05:13.909741-05');
INSERT INTO public.reservas VALUES ('2271ae4e-07d4-46e0-aced-7f7d305c0efc', '2026-11-05', '08:00:00', '11:00:00', 'Ensayo General de Elenco de Danzas', 'Rechazada', 'ad4b36f0-485d-4d2e-b862-0951bcb73006', 'df798811-8cbe-4392-bf19-2778267eed17', '2026-11-03 16:05:13.909744-05');
INSERT INTO public.reservas VALUES ('2d2d6bdc-0643-4cd3-bc6a-8c6b0ce1ffd4', '2026-11-03', '10:00:00', '13:00:00', 'Ceremonia de Apertura del Semestre Academico', 'Aprobada', 'c26cec3f-5ac6-460e-8a1a-90c4c039109c', 'df798811-8cbe-4392-bf19-2778267eed17', '2026-11-03 16:05:13.909724-05');
INSERT INTO public.reservas VALUES ('6950e9ae-1baa-465b-9d42-99fdfee172ee', '2026-11-06', '16:00:00', '18:00:00', 'Reunion de Coordinacion de Practicas Pre Profesionales', 'Cancelada', '7b2532ca-88bb-4f6c-b449-a37d9dc7a302', '62b1ee86-76ba-4e06-aff6-ec6e09976975', '2026-11-03 16:05:13.909745-05');
INSERT INTO public.reservas VALUES ('73a2af39-0e63-4357-b4fe-8aa3a13325c6', '2026-11-04', '08:00:00', '11:00:00', 'Reforzamiento de Algoritmia para Alumnos Observados', 'Rechazada', 'bc19aca7-03a3-4cfa-b075-e1efb7767e25', '1a7b795e-0617-49a8-8ed1-434e38e97b43', '2026-11-03 16:05:13.909744-05');
INSERT INTO public.reservas VALUES ('768c598c-c374-4884-9db3-496da12b216d', '2026-11-05', '09:00:00', '12:00:00', 'Seminario de Actualizacion en Telemedicina Clinica', 'Pendiente', 'ad4b36f0-485d-4d2e-b862-0951bcb73006', '49074fdc-a303-428d-bbf5-c68205dfbbae', '2026-11-03 16:05:13.909742-05');
INSERT INTO public.reservas VALUES ('8e18e91c-e662-47b2-acb2-73e65f884e79', '2026-11-05', '14:00:00', '16:00:00', 'Taller de Bases de Datos Distribuidas PostgreSQL', 'Pendiente', '7b2532ca-88bb-4f6c-b449-a37d9dc7a302', '1a7b795e-0617-49a8-8ed1-434e38e97b43', '2026-11-03 16:05:13.909743-05');
INSERT INTO public.reservas VALUES ('cb5f6d35-9c16-405b-b850-c62dda5d1bd0', '2026-11-06', '10:00:00', '12:00:00', 'Sesion Extraordinaria de Comision Curricular', 'Pendiente', 'bc19aca7-03a3-4cfa-b075-e1efb7767e25', 'f61b2d25-b048-46f2-a48e-22a8e0a05dc2', '2026-11-03 16:05:13.909742-05');
INSERT INTO public.reservas VALUES ('d3e27191-5a43-4a45-ad02-fd3fcbd61861', '2026-11-04', '09:00:00', '11:00:00', 'Sustentacion de Tesis de Titulacion Profesional', 'Aprobada', 'ad4b36f0-485d-4d2e-b862-0951bcb73006', '62b1ee86-76ba-4e06-aff6-ec6e09976975', '2026-11-03 16:05:13.909725-05');
INSERT INTO public.reservas VALUES ('e0b5546b-bdac-4e45-b40d-0fddbeae471b', '2026-11-05', '15:00:00', '18:00:00', 'Conferencia Magistral de Inteligencia Artificial Generativa', 'Aprobada', 'bc19aca7-03a3-4cfa-b075-e1efb7767e25', 'df798811-8cbe-4392-bf19-2778267eed17', '2026-11-03 16:05:13.909737-05');
INSERT INTO public.reservas VALUES ('eea840cf-7578-4f6c-a646-c84bf9a38ca0', '2026-11-02', '14:00:00', '16:00:00', 'Charla de Induccion para Nuevos Ingresantes', 'Aprobada', 'c26cec3f-5ac6-460e-8a1a-90c4c039109c', 'df798811-8cbe-4392-bf19-2778267eed17', '2026-11-03 16:05:13.90974-05');
INSERT INTO public.reservas VALUES ('f032b336-edaf-48cb-bff5-50a84adb4d7c', '2026-11-03', '08:00:00', '10:00:00', 'Taller de Programacion Concurrente en Java', 'Aprobada', '7b2532ca-88bb-4f6c-b449-a37d9dc7a302', '1a7b795e-0617-49a8-8ed1-434e38e97b43', '2026-11-03 16:05:13.909455-05');
INSERT INTO public.reservas VALUES ('f69a135f-db07-4fdf-b0da-f39a4ea4ed73', '2026-11-06', '14:00:00', '17:00:00', 'Practica Libre de Programacion de Brazos Roboticos', 'Aprobada', '7b2532ca-88bb-4f6c-b449-a37d9dc7a302', '6aa842e9-bb8f-4c64-95b0-3903c3fae8bd', '2026-11-03 16:05:13.909739-05');


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.usuarios VALUES ('74f70257-a1c8-4500-805e-1cc372862ba7', 'Maria Quispe Condori', 'maria.quispe@upla.edu.pe', 'AQAAAAIAAYagAAAAEPYxUE4d9EBoVRLfRItVM3XkooEI/3EULPMYYSRwUqPsQ3WWofxeQOoDrWKwbEXGyg==', 'Responsable', true);
INSERT INTO public.usuarios VALUES ('7b2532ca-88bb-4f6c-b449-a37d9dc7a302', 'Carmen Flores Quispe', 'solicitante@upla.edu.pe', 'AQAAAAIAAYagAAAAEPYxUE4d9EBoVRLfRItVM3XkooEI/3EULPMYYSRwUqPsQ3WWofxeQOoDrWKwbEXGyg==', 'Solicitante', true);
INSERT INTO public.usuarios VALUES ('9967ec0c-27ee-4df6-ba3f-e04b3d2fb02f', 'Roberto Salazar Mendoza', 'responsable@upla.edu.pe', 'AQAAAAIAAYagAAAAEPYxUE4d9EBoVRLfRItVM3XkooEI/3EULPMYYSRwUqPsQ3WWofxeQOoDrWKwbEXGyg==', 'Responsable', true);
INSERT INTO public.usuarios VALUES ('a697a0f0-cefc-42a4-a746-7cbacba10dac', 'Administrador Central', 'admin@upla.edu.pe', 'AQAAAAIAAYagAAAAEC3g9hlbHGlR/6m/oMQ1cXcV62nfSEfNgF15AvuK4evrENzh2KYbAhoVoJ+vpK0qag==', 'Administrador', true);
INSERT INTO public.usuarios VALUES ('ad4b36f0-485d-4d2e-b862-0951bcb73006', 'Ana Torres Rojas', 'ana.torres@upla.edu.pe', 'AQAAAAIAAYagAAAAEPYxUE4d9EBoVRLfRItVM3XkooEI/3EULPMYYSRwUqPsQ3WWofxeQOoDrWKwbEXGyg==', 'Solicitante', true);
INSERT INTO public.usuarios VALUES ('bc19aca7-03a3-4cfa-b075-e1efb7767e25', 'David Castro Morales', 'david.castro@upla.edu.pe', 'AQAAAAIAAYagAAAAEPYxUE4d9EBoVRLfRItVM3XkooEI/3EULPMYYSRwUqPsQ3WWofxeQOoDrWKwbEXGyg==', 'Solicitante', true);
INSERT INTO public.usuarios VALUES ('c26cec3f-5ac6-460e-8a1a-90c4c039109c', 'Juan Perez Huaman', 'juan.perez@upla.edu.pe', 'AQAAAAIAAYagAAAAEPYxUE4d9EBoVRLfRItVM3XkooEI/3EULPMYYSRwUqPsQ3WWofxeQOoDrWKwbEXGyg==', 'Solicitante', true);


--
-- Name: __EFMigrationsHistory PK___EFMigrationsHistory; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."__EFMigrationsHistory"
    ADD CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId");


--
-- Name: ambientes PK_ambientes; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ambientes
    ADD CONSTRAINT "PK_ambientes" PRIMARY KEY (id_ambiente);


--
-- Name: reservas PK_reservas; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservas
    ADD CONSTRAINT "PK_reservas" PRIMARY KEY (id_reserva);


--
-- Name: usuarios PK_usuarios; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "PK_usuarios" PRIMARY KEY (id_usuario);


--
-- Name: IX_ambientes_idr_ambiente; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_ambientes_idr_ambiente" ON public.ambientes USING btree (idr_ambiente);


--
-- Name: IX_reservas_ida_reserva_fec_reserva_est_reserva; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_reservas_ida_reserva_fec_reserva_est_reserva" ON public.reservas USING btree (ida_reserva, fec_reserva, est_reserva);


--
-- Name: IX_reservas_idu_reserva; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_reservas_idu_reserva" ON public.reservas USING btree (idu_reserva);


--
-- Name: IX_usuarios_cor_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_usuarios_cor_usuario" ON public.usuarios USING btree (cor_usuario);


--
-- Name: ambientes FK_ambientes_usuarios_idr_ambiente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ambientes
    ADD CONSTRAINT "FK_ambientes_usuarios_idr_ambiente" FOREIGN KEY (idr_ambiente) REFERENCES public.usuarios(id_usuario) ON DELETE SET NULL;


--
-- Name: reservas FK_reservas_ambientes_ida_reserva; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservas
    ADD CONSTRAINT "FK_reservas_ambientes_ida_reserva" FOREIGN KEY (ida_reserva) REFERENCES public.ambientes(id_ambiente) ON DELETE RESTRICT;


--
-- Name: reservas FK_reservas_usuarios_idu_reserva; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservas
    ADD CONSTRAINT "FK_reservas_usuarios_idu_reserva" FOREIGN KEY (idu_reserva) REFERENCES public.usuarios(id_usuario) ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict fWCWDcxEXytgmwPnFXf9CgOEkla59cPRb9pgm6Orfga01gFYLdaOuOzXlD2OAZV

