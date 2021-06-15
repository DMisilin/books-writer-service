CREATE TYPE STATE AS ENUM (
    'enabled',
    'disabled'
    );

COMMENT ON TYPE STATE IS 'Статусы записи';

CREATE SEQUENCE book_id_seq;
CREATE TABLE books (
    book_id INTEGER DEFAULT nextval('book_id_seq') UNIQUE NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    author VARCHAR(150),
    create_datetime TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    state STATE DEFAULT 'enabled'::STATE
);

COMMENT ON TABLE books IS 'Таблица книг';
COMMENT ON COLUMN books.book_id IS 'Идентификатор книги';
COMMENT ON COLUMN books.title IS 'Наименование книги';
COMMENT ON COLUMN books.description IS 'Описание книги';
COMMENT ON COLUMN books.author IS 'Автор книги';
COMMENT ON COLUMN books.create_datetime IS 'Дата и время создания книги';
COMMENT ON COLUMN books.state IS 'Состояние книги';

 CREATE TABLE content (
     text TEXT NOT NULL,
     book_id INTEGER NOT NULL
        CONSTRAINT content_book_id_fkey
            REFERENCES books (book_id),
     hash uuid NOT NULL,
     hash_next uuid NULL,
     hash_prev uuid NULL,
     last BOOLEAN DEFAULT false,
     first BOOLEAN DEFAULT false,
     create_datetime TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     modify_datetime TIMESTAMP WITH TIME ZONE,
     state STATE DEFAULT 'enabled'::STATE
 );

COMMENT ON TABLE content IS 'Таблица с контентом книг';
COMMENT ON COLUMN content.text IS 'Текст блока';
COMMENT ON COLUMN content.book_id IS 'Идентификатор книги';
COMMENT ON COLUMN content.hash IS 'Хэш блока контента';
COMMENT ON COLUMN content.hash_next IS 'Хэш следующего блока';
COMMENT ON COLUMN content.hash_prev IS 'Хэш предыдущего блока';
COMMENT ON COLUMN content.create_datetime IS 'Дата и время создания блока контента';
COMMENT ON COLUMN content.modify_datetime IS 'Дата и время изменения блока контента';
COMMENT ON COLUMN content.state IS 'Состояние книги';
