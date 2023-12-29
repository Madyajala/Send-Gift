[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://github.com/Madyajala/Send-Gift.git)
# Send Gift

## Ringkasan

Membuat aplikasi bernama `Send Gift`, sebuah web server node.js untuk membantu menampilkan list gift voucher. Feature utama dari aplikasi ini adalah:

1. Dapat `menampilkan seluruh gift voucher`
2. User dapat `memberikan gift` voucher kepada user lain
3. User yang menerima voucher dapat melakukan `claim` terhadap voucher tersebut


## Setup Project

Lakukan setup project dengan menginstall package yang sudah diajarkan sebelumnya dan buatlah error handling (global error), skema database sesuai dengan `api_doc.md`. Terdapat 3 Model pada project ini:

1. Table User
2. Table Voucher
3. Table Gift

Catatan:
Perhatikan relasi antara `User`, `Gift`, dan `Voucher` dan gunakan definisi relasi yang sesuai pada sequelize relation [doc](https://sequelize.org/master/manual/advanced-many-to-many.html).

## Authentication: Register

Buatlah sebuah endpoint yang digunakan untuk menambahkan User ke dalam aplikasi dengan detail sebagai berikut:

- Buatlah routing: `POST /register`
- Menerima request body, status code, response success dan response error sesuai `api_doc.md` no. 1
- Pastikan, password di hash menggunakan `bcrypt` sebelum di simpan dalam database

## Authentication: Login

Buatlah sebuah endpoint yang digunakan untuk authentication User dengan detail sebagai berikut:

- Buatlah routing: `POST /login`
- Menerima request body, status code, response success dan response error sesuai `api_doc.md` no. 2
- Membuat token menggunakan `jsonwebtoken`

## Fetch Vouchers

Buatlah sebuah endpoint untuk valid user yang digunakan untuk mendapatkan semua list voucher pada aplikasi dengan detail sebagai berikut:

- Buatlah routing: `GET /vouchers`
- Menerima headers, status code, response success dan response error (global error) sesuai `api_doc.md` no. 3
- Authentication Check: melakukan pengecekan apakah User tersebut valid sebelum request endpoint

Catatan:
> Untuk initial data atau data awal voucher, lakukan seeding sesuai dengan data json yang sudah diberikan bernama `voucher.json`

## Send Voucher (Create Gift)

Buatlah sebuah endpoint untuk valid user yang digunakan untuk melakukan pengiriman voucher dari `Valid User A` ke `Valid User B` pada aplikasi dengan detail sebagai berikut:

- Buatlah routing: `POST /gifts/:voucherId`
- Menerima headers, params, body, status code, response success dan response error (+global error) sesuai `api_doc.md` no. 4
- Authentication Check: melakukan pengecekan apakah User tersebut valid sebelum request endpoint
- Default value Model Gift: status: `unclaimed` & amount: `0`

## Fetch Gifts (Current User)

Buatlah sebuah endpoint untuk valid user yang digunakan user tersebut untuk mendapatkan seluruh gift yang user terima dengan detail sebagai berikut:

- Buatlah routing: `GET /gifts`
- Menerima headers, status code, response success dan response error (global error) sesuai `api_doc.md` no. 5
- Authentication Check: melakukan pengecekan apakah User tersebut valid sebelum request endpoint
- Authorization Check: Pastikan, data yang ditampilkan HANYA data user yang sedang login, bukan semua data (recipient's ownership)

## Update Gifts

Buatlah sebuah endpoint untuk valid user yang digunakan user tersebut untuk merubah atau mengupdate `gift amount` dan `gift message` yang sudah dibuat dengan detail sebagai berikut:

- Buatlah routing: `PATCH /gifts/:id`
- Menerima headers, params, body, status code, response success dan response error (global error) sesuai `api_doc.md` no. 6
- Authentication Check: melakukan pengecekan apakah User tersebut valid sebelum request endpoint
- Authorization Check: Pastikan, data yang diubah hanya data yang dibuat oleh user tersebut (sender's ownership)

## Delete Gifts

Buatlah sebuah endpoint untuk valid user yang digunakan user tersebut untuk menghapus gift yang pernah dibuat dengan detail sebagai berikut:

- Buatlah routing: `DELETE /gifts/:id`
- Menerima headers, params, status code, response success dan response error (global error) sesuai `api_doc.md` no. 7
- Authentication Check: melakukan pengecekan apakah User tersebut valid sebelum request endpoint
- Authorization Check: data yang dihapus hanya data yang dibuat oleh user tersebut (sender's ownership)

## Claim Gift

Buatlah sebuah endpoint untuk valid user yang digunakan user tersebut untuk meng-claim gift yang dia dapat dengan detail sebagai berikut:

- Buatlah routing: `PATCH /gifts/:id/claim`
- Menerima headers, params, status code, response success dan response error (global error) sesuai `api_doc.md` no. 8
- Authentication Check: melakukan pengecekan apakah User tersebut valid sebelum request endpoint
- Authorization Check: data yang di-claim hanya data yang diberikan kepada user tersebut (recipient's ownership)

## Testing

Pastikan semua release yang sudah dikerjakan sesuai dengan testing yang sudah dibuat. Lakukan `testing` dengan langkah berikut:

- Drop db testing: `sequelize --env test db:drop`
- Create db testing: `sequelize --env test db:create`
- Migrate db testing: `sequelize --env test db:migrate`
- Ketika run test buatlah `bin/www` untuk menjalankan aplikasi express, pada file `app.js` lakukan `module.exports = app`
- Pada package.json tambahkan script `"test": "jest --runInBand --forceExit"`
