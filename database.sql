-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 22, 2022 at 01:19 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


CREATE DATABASE `onlinebanking`;
USE `onlinebanking`;
-- --------------------------------------------------------



CREATE TABLE `chuyentien` (
  `IDChuyenTien` int(11) NOT NULL,
  `username` int(11) NOT NULL,
  `SDTNguoiNhan` varchar(12) NOT NULL,
  `SoTien` double NOT NULL,
  `TrangThai` int(11) NOT NULL,
  `BenChiuPhi` int(11) NOT NULL,
  `LoaiGiaoDich` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `muathe` (
  `IDGiaoDich` int(11) NOT NULL,
  `username` int(11) NOT NULL,
  `ThoiGian` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



CREATE TABLE `otp` (
  `id` int(11) NOT NULL,
  `username` int(11) NOT NULL,
  `OTPKey` int(11) NOT NULL,
  `TimeSt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



CREATE TABLE `taikhoan` (
  `username` int(11) NOT NULL,
  `SoDu` int(11) DEFAULT 0,
  `NgayReset` date DEFAULT curdate(),
  `GiaoDichConLai` int(11) DEFAULT 2
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



CREATE TABLE `themua` (
  `IDGiaoDich` int(11) NOT NULL,
  `NhaMang` varchar(30) NOT NULL,
  `MaThe` varchar(30) NOT NULL,
  `MenhGia` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



CREATE TABLE `thetindung` (
  `SoThe` int(11) NOT NULL,
  `NgayHetHan` date NOT NULL,
  `CVV` int(11) NOT NULL,
  `GhiChu` varchar(5000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



CREATE TABLE `user` (
  `SoDienThoai` varchar(12) NOT NULL,
  `Email` varchar(50) NOT NULL,
  `HoVaTen` varchar(50) NOT NULL,
  `NgayThangNamSinh` date NOT NULL,
  `DiaChi` varchar(50) NOT NULL,
  `username` int(10) UNSIGNED ZEROFILL NOT NULL,
  `password` varchar(30) NOT NULL,
  `DangNhapLanDau` binary(1) DEFAULT '1',
  `trangthai` int(11) DEFAULT 0,
  `DangNhapThatBai` int(11) DEFAULT 0,
  `ThoiGianVoHieuHoa` datetime DEFAULT NULL,
  `LoaiTaiKhoan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


ALTER TABLE `chuyentien`
  ADD PRIMARY KEY (`IDChuyenTien`);


ALTER TABLE `muathe`
  ADD PRIMARY KEY (`IDGiaoDich`);


ALTER TABLE `otp`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `thetindung`
  ADD PRIMARY KEY (`SoThe`);


ALTER TABLE `user`
  ADD PRIMARY KEY (`username`);


ALTER TABLE `chuyentien`
  MODIFY `IDChuyenTien` int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `muathe`
  MODIFY `IDGiaoDich` int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `otp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `user`
  MODIFY `username` int(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
