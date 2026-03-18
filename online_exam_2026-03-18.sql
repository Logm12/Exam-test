--
-- PostgreSQL database dump
--

\restrict Hd4GBHjw5jcY3QbfePStHhzIeflWShFKlqZTH3ZgogIMlLydLGVtG5thcLYU9Sg

-- Dumped from database version 15.17
-- Dumped by pg_dump version 15.17

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


--
-- Name: answers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.answers (
    id integer NOT NULL,
    submission_id integer,
    question_id integer,
    selected_option character varying,
    text_response character varying
);


--
-- Name: answers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.answers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: answers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.answers_id_seq OWNED BY public.answers.id;


--
-- Name: exams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exams (
    id integer NOT NULL,
    title character varying NOT NULL,
    start_time timestamp with time zone NOT NULL,
    duration integer NOT NULL,
    is_published boolean,
    created_at timestamp with time zone DEFAULT now(),
    theme_config jsonb,
    slug character varying(12),
    description character varying,
    cover_image character varying
);


--
-- Name: exams_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.exams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: exams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.exams_id_seq OWNED BY public.exams.id;


--
-- Name: organizational_units; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organizational_units (
    id integer NOT NULL,
    name character varying NOT NULL,
    description character varying,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: organizational_units_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.organizational_units_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: organizational_units_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.organizational_units_id_seq OWNED BY public.organizational_units.id;


--
-- Name: question_pools; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.question_pools (
    id integer NOT NULL,
    name character varying NOT NULL,
    description character varying,
    org_unit_id integer,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: question_pools_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.question_pools_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: question_pools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.question_pools_id_seq OWNED BY public.question_pools.id;


--
-- Name: questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.questions (
    id integer NOT NULL,
    exam_id integer,
    content character varying NOT NULL,
    type character varying NOT NULL,
    options jsonb,
    correct_answer character varying NOT NULL,
    pool_id integer
);


--
-- Name: questions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.questions_id_seq OWNED BY public.questions.id;


--
-- Name: students; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.students (
    id integer NOT NULL,
    user_id integer,
    stt integer,
    full_name character varying NOT NULL,
    date_of_birth date,
    class_name character varying,
    mssv character varying,
    school character varying
);


--
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- Name: submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.submissions (
    id integer NOT NULL,
    exam_id integer,
    user_id integer,
    score double precision,
    status character varying,
    submitted_at timestamp with time zone,
    violation_count integer,
    forced_submit character varying,
    correct_count integer,
    time_spent_seconds integer
);


--
-- Name: submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.submissions_id_seq OWNED BY public.submissions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying NOT NULL,
    password_hash character varying NOT NULL,
    role character varying,
    org_unit_id integer
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: answers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.answers ALTER COLUMN id SET DEFAULT nextval('public.answers_id_seq'::regclass);


--
-- Name: exams id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exams ALTER COLUMN id SET DEFAULT nextval('public.exams_id_seq'::regclass);


--
-- Name: organizational_units id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizational_units ALTER COLUMN id SET DEFAULT nextval('public.organizational_units_id_seq'::regclass);


--
-- Name: question_pools id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_pools ALTER COLUMN id SET DEFAULT nextval('public.question_pools_id_seq'::regclass);


--
-- Name: questions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions ALTER COLUMN id SET DEFAULT nextval('public.questions_id_seq'::regclass);


--
-- Name: students id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- Name: submissions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submissions ALTER COLUMN id SET DEFAULT nextval('public.submissions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.alembic_version (version_num) FROM stdin;
e52cb1e3d445
\.


--
-- Data for Name: answers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.answers (id, submission_id, question_id, selected_option, text_response) FROM stdin;
1	1	\N	B	\N
5	4	\N	\N	\N
2	2	\N	B	\N
3	2	\N	\N	6hdnfendjedd
4	3	\N	C	\N
6	5	24	\N	\N
7	5	25	\N	\N
\.


--
-- Data for Name: exams; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.exams (id, title, start_time, duration, is_published, created_at, theme_config, slug, description, cover_image) FROM stdin;
2	mèo	2026-03-13 15:30:05.628+00	1	t	2026-03-13 15:30:05.680112+00	null	rvJmuOhfHs	\N	/uploads/exam_2_dc1f958e.gif
3	2222	2026-03-13 15:38:42.331+00	60	t	2026-03-13 15:38:42.371006+00	null	TnJOAxlBCC	\N	/uploads/exam_3_07f0005b.gif
1	mid	2026-03-13 08:51:33.453+00	60	t	2026-03-13 08:51:33.511695+00	null	0vOFKc5po1	\N	/uploads/exam_1_2781dbe8.gif
4	33	2026-03-13 16:17:54.79+00	60	t	2026-03-13 16:17:54.919139+00	null	qjeX4WWsXO	\N	/uploads/exam_4_ce6f9e2f.gif
\.


--
-- Data for Name: organizational_units; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.organizational_units (id, name, description, created_at) FROM stdin;
\.


--
-- Data for Name: question_pools; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.question_pools (id, name, description, org_unit_id, created_at) FROM stdin;
\.


--
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.questions (id, exam_id, content, type, options, correct_answer, pool_id) FROM stdin;
23	3	222	multiple_choice	{"A": "2", "B": "2", "C": "2", "D": "2"}	A	\N
24	2	mèo là gì	multiple_choice	{"A": "gà", "B": "chó", "C": "cat", "D": "miu"}	A	\N
25	2	kkk	short_answer	{"A": "dd", "B": "d", "C": "d", "D": "d"}	Adffefef	\N
26	1	đjnede	multiple_choice	{"A": "1", "B": "2", "C": "3", "D": "4"}	C	\N
27	4	1	multiple_choice	{"A": "13", "B": "13", "C": "1", "D": "1"}	A	\N
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.students (id, user_id, stt, full_name, date_of_birth, class_name, mssv, school) FROM stdin;
1	2	1	Test Student 1773817192	2005-01-02	12A1	MSSV_TEST_1773817192	Test School
2	3	1	Phan Thị Tuấn	2008-07-28	10A1	SV000001	THPT Lý Tự Trọng
3	4	2	Bùi Đức Hân	2006-05-07	10A1	SV000002	THPT Lý Tự Trọng
4	5	3	Hồ Đức Hải	2004-10-15	10A1	SV000003	THPT Chuyên Lê Hồng Phong
5	6	4	Bùi Hữu Thảo	2006-04-01	12A3	SV000004	THPT Nguyễn Thượng Hiền
6	7	5	Lý Thanh Khoa	2007-09-05	12A1	SV000005	THPT Lý Tự Trọng
7	8	6	Hồ Văn Quỳnh	2006-03-05	10A3	SV000006	THPT Nguyễn Du
8	9	7	Đỗ Quang Quỳnh	2008-02-08	12A1	SV000007	THPT Nguyễn Thượng Hiền
9	10	8	Lê Thị Hoà	2004-11-08	10A2	SV000008	THPT Trần Phú
10	11	9	Lý Gia Hùng	2005-09-21	10A1	SV000009	THPT Nguyễn Du
11	12	10	Trần Minh Phúc	2007-03-20	11A1	SV000010	THPT Chuyên Lê Hồng Phong
12	13	11	Võ Gia Hải	2005-06-15	11A1	SV000011	THPT Chuyên Lê Hồng Phong
13	14	12	Phan Thanh Hoà	2004-10-01	12A2	SV000012	THPT Lý Tự Trọng
14	15	13	Hoàng Văn Linh	2005-05-02	11A1	SV000013	THPT Trần Phú
15	16	14	Lê Thanh Vân	2007-03-09	11A1	SV000014	THPT Lý Tự Trọng
16	17	15	Hồ Quang Tuấn	2005-02-13	11A2	SV000015	THPT Nguyễn Du
17	18	16	Hồ Thị Mai	2008-05-23	10A2	SV000016	THPT Trần Phú
18	19	17	Đỗ Đức Bình	2005-06-12	11A2	SV000017	THPT Nguyễn Du
19	20	18	Trần Gia Nhi	2004-06-23	10A1	SV000018	THPT Nguyễn Du
20	21	19	Lý Thanh Dũng	2005-05-25	10A2	SV000019	THPT Chuyên Lê Hồng Phong
21	22	20	Phạm Hữu Hùng	2007-04-04	10A3	SV000020	THPT Chuyên Lê Hồng Phong
22	23	21	Hồ Thanh Nam	2005-01-19	12A3	SV000021	THPT Chuyên Lê Hồng Phong
23	24	22	Vũ Thị Hải	2006-10-15	12A2	SV000022	THPT Nguyễn Thượng Hiền
24	25	23	Bùi Thanh Hoà	2006-12-23	12A3	SV000023	THPT Chuyên Lê Hồng Phong
25	26	24	Võ Thanh Thảo	2007-12-16	10A1	SV000024	THPT Nguyễn Du
26	27	25	Đỗ Văn Khánh	2004-09-18	10A2	SV000025	THPT Lý Tự Trọng
\.


--
-- Data for Name: submissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.submissions (id, exam_id, user_id, score, status, submitted_at, violation_count, forced_submit, correct_count, time_spent_seconds) FROM stdin;
1	1	2	0	submitted	2026-03-13 15:00:08.805548+00	0	false	\N	\N
2	2	2	0	submitted	2026-03-13 15:30:44.630398+00	0	false	\N	\N
3	3	2	0	submitted	2026-03-13 15:38:58.879421+00	0	false	\N	\N
4	4	2	0	submitted	2026-03-13 16:25:19.378746+00	2	false	\N	\N
5	2	3	0	submitted	2026-03-18 10:27:09.560747+00	2	false	0	1200
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, password_hash, role, org_unit_id) FROM stdin;
1	admin	$2b$12$kufzt/t0IlZOILqYN1mWEOIMfrF6QzjNJ0XEuIBhBF7Tgt3gfHroW	admin	\N
2	student	$2b$12$vSzDsv3ApWVSb0z/kkSpUemC4FF6JCWQ3/qFbD9jjvFa4g/xpF/yS	student	\N
3	student001	$2b$12$yetqW1M40OK7RGGBsPXlleDZjbYgM7jbpGIKkyo0dglhrSSbGR5wS	student	\N
4	student002	$2b$12$a89olquPRlWmb3KICYp64uC1rGLLheD5ClZx2sNrNZENf7h49mXsO	student	\N
5	student003	$2b$12$v9O9vVpwz5NurZ7TfCXaf.c7Z2h3lEPkv3xaqLV46ZwDCLPtsh/R2	student	\N
6	student004	$2b$12$npjwZ5/KRtvC9OAtdfwgFerCgM8nijdvDTWNQw8kLPMVpKqRfxwF6	student	\N
7	student005	$2b$12$1h0BgzUVgeLF/Ns8mxlZHO4e0JHwee5FnGfyDDcOJuriCIox0Skya	student	\N
8	student006	$2b$12$x6Pr/KPztaD7bqjfRoL5mehXxTn5K8Wx6lZmcOF59kz2YVxQ1ckDK	student	\N
9	student007	$2b$12$ONU3pzOzGlVP7xgeHyvL5eyjXPDkzcJrNtAFhSVJolLqCIHblMmWK	student	\N
10	student008	$2b$12$oj3rvpOd/aal6FWthrxn..3.NlilWkPrqXMU8PCNpWCJMVc0dIY16	student	\N
11	student009	$2b$12$76BeFLHSd3t9u3OjcJ.wHeTVuRtujprMxqNPM7r23t/6rv6mO6rI.	student	\N
12	student010	$2b$12$Q/u8zsxFMOzL/w/tc40lwedctdqDpfyqkH7Rep5rCZ74vIiBbamvq	student	\N
13	student011	$2b$12$pPi/wE.ZGeHszIeTrWFU6.mIoOHFdzrtXbn9aVqbJbjijz2GzkzPm	student	\N
14	student012	$2b$12$5pV8rAorvLXxeThcx2ZMrexB4qXKQqn5OaKV2w9bDgm84x7HrTZO.	student	\N
15	student013	$2b$12$F88dP5gGoRl9/FQUyRKD0OPiwA.JfbCaR/9obFMTdftiL9sAPdNtS	student	\N
16	student014	$2b$12$KFA3/fHcYdOjZPRwjQ18fufbXRi1j0IJ6cvnwV0pDjoJr27H5naQ6	student	\N
17	student015	$2b$12$A49mncPK4O2FfIgXDzkRiOR9uvMieOTmWjRWfq8qtTTxJ5Jl4AHla	student	\N
18	student016	$2b$12$rVxCqQj3NCnFDzKjcJIupuY4sI1GPnnzNZsb7QVfwbW4e9ysg3DTG	student	\N
19	student017	$2b$12$O8s.4GtpICjTAvKjM/nXVu0OUcxupxY9As.i6dZLdai.HOSg1tejG	student	\N
20	student018	$2b$12$fgOWW8lua4LL0wWzdi1bzu0406Ji0DhF7EG89.AHBgVd3iOxH.0lG	student	\N
21	student019	$2b$12$Oe9AV846CdLR0p449SLsluGpRpAHaArw0Jv7bTw3YVDmgMxnW0cWa	student	\N
22	student020	$2b$12$EpKJbgJ6HQQOIAM/waYrjugeSHg59xNxTrOkaiDWjCtqFnaLNYuJ2	student	\N
23	student021	$2b$12$5MOUYsh8DP8xQRtPGJnqFuHUg5ssVMxaO2hjEdzO.0eCN7xcdGwU6	student	\N
24	student022	$2b$12$2AN1mkb14/DX8EmheaqZnOLU5YQoTUvk8YMvW6.jqVAz16.PmMlk2	student	\N
25	student023	$2b$12$MeiZDaimiBDk.rh3d4TVteoBVxew9Z5Gda1knSqI3Al7Bfv5rFOjC	student	\N
26	student024	$2b$12$40ywRvUBw8WgTYloOQUawOUAT5YhBHspseZjJInPgaH/a2ck6gr96	student	\N
27	student025	$2b$12$6lnv.6Dg5StOZnuCWICjbuoROjkbHF4C4CnsXMuSYc1aPBZZ62rKy	student	\N
\.


--
-- Name: answers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.answers_id_seq', 7, true);


--
-- Name: exams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.exams_id_seq', 4, true);


--
-- Name: organizational_units_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.organizational_units_id_seq', 1, false);


--
-- Name: question_pools_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.question_pools_id_seq', 1, false);


--
-- Name: questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.questions_id_seq', 27, true);


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.students_id_seq', 26, true);


--
-- Name: submissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.submissions_id_seq', 5, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 27, true);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: answers answers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_pkey PRIMARY KEY (id);


--
-- Name: exams exams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT exams_pkey PRIMARY KEY (id);


--
-- Name: organizational_units organizational_units_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizational_units
    ADD CONSTRAINT organizational_units_pkey PRIMARY KEY (id);


--
-- Name: question_pools question_pools_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_pools
    ADD CONSTRAINT question_pools_pkey PRIMARY KEY (id);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: submissions submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_pkey PRIMARY KEY (id);


--
-- Name: students uq_students_mssv; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT uq_students_mssv UNIQUE (mssv);


--
-- Name: students uq_students_user_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT uq_students_user_id UNIQUE (user_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ix_answers_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_answers_id ON public.answers USING btree (id);


--
-- Name: ix_exams_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_exams_id ON public.exams USING btree (id);


--
-- Name: ix_exams_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_exams_slug ON public.exams USING btree (slug);


--
-- Name: ix_organizational_units_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_organizational_units_id ON public.organizational_units USING btree (id);


--
-- Name: ix_organizational_units_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_organizational_units_name ON public.organizational_units USING btree (name);


--
-- Name: ix_question_pools_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_question_pools_id ON public.question_pools USING btree (id);


--
-- Name: ix_question_pools_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_question_pools_name ON public.question_pools USING btree (name);


--
-- Name: ix_questions_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_questions_id ON public.questions USING btree (id);


--
-- Name: ix_students_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_students_id ON public.students USING btree (id);


--
-- Name: ix_students_mssv; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_students_mssv ON public.students USING btree (mssv);


--
-- Name: ix_students_stt; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_students_stt ON public.students USING btree (stt);


--
-- Name: ix_students_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_students_user_id ON public.students USING btree (user_id);


--
-- Name: ix_submissions_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_submissions_id ON public.submissions USING btree (id);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: ix_users_username; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_users_username ON public.users USING btree (username);


--
-- Name: answers answers_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;


--
-- Name: answers answers_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.submissions(id) ON DELETE CASCADE;


--
-- Name: question_pools question_pools_org_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_pools
    ADD CONSTRAINT question_pools_org_unit_id_fkey FOREIGN KEY (org_unit_id) REFERENCES public.organizational_units(id) ON DELETE CASCADE;


--
-- Name: questions questions_exam_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id) ON DELETE CASCADE;


--
-- Name: questions questions_pool_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pool_id_fkey FOREIGN KEY (pool_id) REFERENCES public.question_pools(id) ON DELETE SET NULL;


--
-- Name: students students_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: submissions submissions_exam_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id) ON DELETE CASCADE;


--
-- Name: submissions submissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users users_org_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_org_unit_id_fkey FOREIGN KEY (org_unit_id) REFERENCES public.organizational_units(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict Hd4GBHjw5jcY3QbfePStHhzIeflWShFKlqZTH3ZgogIMlLydLGVtG5thcLYU9Sg

