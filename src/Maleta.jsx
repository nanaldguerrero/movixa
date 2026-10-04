import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { nacionalidadDesde } from './nacionalidadUtils'
import './Maleta.css'

/* =========================================================
   ICONOS SVG DE MOVIXA
   ========================================================= */

function IconoMaleta({ tipo, size = 42 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 48 48',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    className: 'mal-icono-svg',
    'aria-hidden': true,
  }

  switch (tipo) {
    case 'camiseta':
      return (
        <svg {...common}>
          <path
            d="M15 8L20 5H28L33 8L39 12L35 20L31 18V40H17V18L13 20L9 12L15 8Z"
            fill="#BDA8FF"
          />
          <path
            d="M20 5C20 9 28 9 28 5"
            stroke="#6944D8"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M17 18L13 20M31 18L35 20"
            stroke="#6944D8"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'pantalon':
      return (
        <svg {...common}>
          <path
            d="M15 7H33L35 18L29 41H24L22 27L19 41H14L13 18L15 7Z"
            fill="#91C8F8"
          />
          <path
            d="M15 7H33"
            stroke="#477FBE"
            strokeWidth="2"
          />
          <path
            d="M24 10V25"
            stroke="#477FBE"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'ropa':
      return (
        <svg {...common}>
          <path
            d="M17 7L22 5H26L31 7L35 12L31 16L28 13V40H20V13L17 16L13 12L17 7Z"
            fill="#F2A9D8"
          />
          <path
            d="M22 5C22 8 26 8 26 5"
            stroke="#B45A98"
            strokeWidth="2"
          />
        </svg>
      )

    case 'medias':
      return (
        <svg {...common}>
          <path
            d="M16 7H25V26L34 30C37 31 38 35 35 37L30 40H16C13 40 11 38 12 35L16 27V7Z"
            fill="#A9D8F5"
          />
          <path
            d="M16 13H25"
            stroke="#5C9FC8"
            strokeWidth="2"
          />
        </svg>
      )

    case 'pijama':
      return (
        <svg {...common}>
          <path
            d="M14 9L20 6L24 11L28 6L34 9L39 18L34 21L31 16V40H17V16L14 21L9 18L14 9Z"
            fill="#C6B5F4"
          />
          <path
            d="M17 29H31"
            stroke="#7557C9"
            strokeWidth="2"
          />
        </svg>
      )

    case 'zapatos':
      return (
        <svg {...common}>
          <path
            d="M10 31C15 31 17 26 19 18L25 21L27 28L36 31C39 32 41 35 39 38H12C9 38 8 34 10 31Z"
            fill="#9E8BD8"
          />
          <path
            d="M12 34H38"
            stroke="#6045A5"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'chaqueta':
      return (
        <svg {...common}>
          <path
            d="M17 7L22 5H26L31 7L36 13L31 18L29 15V41H19V15L17 18L12 13L17 7Z"
            fill="#8AB8E8"
          />
          <path
            d="M24 8V40"
            stroke="#4B78AD"
            strokeWidth="2"
          />
          <circle cx="24" cy="14" r="1.5" fill="#4B78AD" />
          <circle cx="24" cy="20" r="1.5" fill="#4B78AD" />
        </svg>
      )

    case 'bano':
      return (
        <svg {...common}>
          <path
            d="M10 25H38"
            stroke="#4A9FD1"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M13 25V31C13 35 16 38 20 38H30C34 38 37 35 37 31V25"
            fill="#A8DCF7"
          />
          <path
            d="M17 10V25M17 10C17 7 22 7 22 11V15"
            stroke="#4A9FD1"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M10 38H38"
            stroke="#4A9FD1"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'cepillo':
      return (
        <svg {...common}>
          <rect
            x="21"
            y="17"
            width="7"
            height="24"
            rx="3"
            transform="rotate(-20 21 17)"
            fill="#79C7EE"
          />
          <path
            d="M18 8H29V15C29 17 27 18 24 18C21 18 18 17 18 15V8Z"
            fill="#B9E9FA"
          />
          <path
            d="M20 8V4M24 8V4M28 8V4"
            stroke="#5A9CC0"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'pasta':
      return (
        <svg {...common}>
          <path
            d="M17 10H31L29 39H19L17 10Z"
            fill="#D7B4F5"
          />
          <path
            d="M16 10H32V15H16V10Z"
            fill="#8D63D7"
          />
          <path
            d="M20 21H28"
            stroke="#8D63D7"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M21 26H27"
            stroke="#8D63D7"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'shampoo':
      return (
        <svg {...common}>
          <path
            d="M17 14H31V40H17V14Z"
            fill="#8BD7F5"
          />
          <path
            d="M20 14V9H28V14"
            stroke="#4D9BC5"
            strokeWidth="2"
          />
          <path
            d="M25 9V6H32"
            stroke="#4D9BC5"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M20 23H28"
            stroke="#4D9BC5"
            strokeWidth="2"
          />
        </svg>
      )

    case 'jabon':
      return (
        <svg {...common}>
          <rect
            x="11"
            y="18"
            width="26"
            height="19"
            rx="7"
            fill="#C9B8F5"
          />
          <circle cx="19" cy="14" r="4" fill="#A7DDF5" />
          <circle cx="27" cy="10" r="3" fill="#B9E9FA" />
          <circle cx="32" cy="15" r="2.5" fill="#E8D8FF" />
        </svg>
      )

    case 'desodorante':
      return (
        <svg {...common}>
          <path
            d="M17 13H31V40H17V13Z"
            fill="#B4DDF7"
          />
          <path
            d="M20 13V9H29V13"
            stroke="#5A9CC0"
            strokeWidth="2"
          />
          <path
            d="M23 9V6H31"
            stroke="#5A9CC0"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'protector':
      return (
        <svg {...common}>
          <path
            d="M16 12H32V39H16V12Z"
            fill="#F7D58C"
          />
          <path
            d="M19 12V8H29V12"
            stroke="#C99635"
            strokeWidth="2"
          />
          <circle cx="24" cy="25" r="6" fill="#FFE8AA" />
          <path
            d="M24 21V29M20 25H28"
            stroke="#D9A53D"
            strokeWidth="2"
          />
        </svg>
      )

    case 'medicina':
      return (
        <svg {...common}>
          <rect
            x="9"
            y="15"
            width="30"
            height="24"
            rx="5"
            fill="#F2A7B7"
          />
          <path
            d="M19 15V11C19 8 21 6 24 6C27 6 29 8 29 11V15"
            stroke="#C45D78"
            strokeWidth="2"
          />
          <path
            d="M24 20V33M17.5 26.5H30.5"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'botiquin':
      return (
        <svg {...common}>
          <rect
            x="9"
            y="16"
            width="30"
            height="22"
            rx="5"
            fill="#F4A9B9"
          />
          <path
            d="M17 16V12C17 9 19 7 24 7C29 7 31 9 31 12V16"
            stroke="#C65F79"
            strokeWidth="2"
          />
          <path
            d="M24 20V34M17 27H31"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'curitas':
      return (
        <svg {...common}>
          <path
            d="M13 12C15 10 18 10 20 12L36 28C38 30 38 33 36 35C34 37 31 37 29 35L13 19C11 17 11 14 13 12Z"
            fill="#F3C59C"
          />
          <path
            d="M28 12C30 10 33 10 35 12C37 14 37 17 35 19L19 35C17 37 14 37 12 35C10 33 10 30 12 28L28 12Z"
            fill="#F3C59C"
          />
          <circle cx="18" cy="18" r="2" fill="#E29A70" />
          <circle cx="30" cy="30" r="2" fill="#E29A70" />
        </svg>
      )

    case 'repelente':
      return (
        <svg {...common}>
          <path
            d="M16 13H32V40H16V13Z"
            fill="#A8DDA9"
          />
          <path
            d="M19 13V8H29V13"
            stroke="#5C9C62"
            strokeWidth="2"
          />
          <circle cx="24" cy="26" r="6" fill="#D5F1D1" />
          <path
            d="M21 29L27 23M27 29L21 23"
            stroke="#5C9C62"
            strokeWidth="2"
          />
        </svg>
      )

    case 'celular':
      return (
        <svg {...common}>
          <rect
            x="14"
            y="5"
            width="20"
            height="38"
            rx="4"
            fill="#8E83D9"
          />
          <rect
            x="17"
            y="10"
            width="14"
            height="25"
            rx="2"
            fill="#DDF3FF"
          />
          <circle cx="24" cy="39" r="1.5" fill="#FFFFFF" />
        </svg>
      )

    case 'cargador':
      return (
        <svg {...common}>
          <rect
            x="15"
            y="9"
            width="18"
            height="13"
            rx="3"
            fill="#A6B5E8"
          />
          <path
            d="M20 22V29C20 32 23 34 26 34H31"
            stroke="#6577B9"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M20 9V5M28 9V5"
            stroke="#6577B9"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'powerbank':
      return (
        <svg {...common}>
          <rect
            x="14"
            y="8"
            width="20"
            height="32"
            rx="5"
            fill="#8FA4DF"
          />
          <path
            d="M25 14L20 25H24L22 34L29 22H25L28 14H25Z"
            fill="#FFF0A8"
          />
        </svg>
      )

    case 'audifonos':
      return (
        <svg {...common}>
          <path
            d="M12 27V21C12 14 17 9 24 9C31 9 36 14 36 21V27"
            stroke="#7656D7"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <rect x="9" y="25" width="8" height="12" rx="4" fill="#9F87E5" />
          <rect x="31" y="25" width="8" height="12" rx="4" fill="#9F87E5" />
        </svg>
      )

    case 'adaptador':
      return (
        <svg {...common}>
          <rect
            x="13"
            y="15"
            width="22"
            height="20"
            rx="4"
            fill="#B8C7EE"
          />
          <path
            d="M19 15V9M29 15V9"
            stroke="#6276B4"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M18 27H30"
            stroke="#6276B4"
            strokeWidth="2"
          />
        </svg>
      )

    case 'pasaporte':
      return (
        <svg {...common}>
          <rect
            x="10"
            y="7"
            width="28"
            height="34"
            rx="4"
            fill="#7562C9"
          />
          <circle
            cx="24"
            cy="22"
            r="7"
            stroke="#F2E9FF"
            strokeWidth="2"
          />
          <path
            d="M17 31H31"
            stroke="#F2E9FF"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M24 15V29M18 22H30"
            stroke="#F2E9FF"
            strokeWidth="1.5"
          />
        </svg>
      )

    case 'identificacion':
      return (
        <svg {...common}>
          <rect
            x="8"
            y="12"
            width="32"
            height="24"
            rx="4"
            fill="#B4DDF4"
          />
          <circle cx="17" cy="24" r="5" fill="#7E9FBE" />
          <path
            d="M25 21H34M25 26H34"
            stroke="#65819D"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'tarjeta':
      return (
        <svg {...common}>
          <rect
            x="7"
            y="12"
            width="34"
            height="24"
            rx="4"
            fill="#8A76D6"
          />
          <path
            d="M7 19H41"
            stroke="#DCD5FF"
            strokeWidth="3"
          />
          <rect
            x="12"
            y="26"
            width="8"
            height="4"
            rx="1"
            fill="#DCD5FF"
          />
        </svg>
      )

    case 'dinero':
      return (
        <svg {...common}>
          <rect
            x="9"
            y="12"
            width="30"
            height="24"
            rx="4"
            fill="#9AD5AE"
          />
          <circle cx="24" cy="24" r="7" fill="#DDF4E3" />
          <path
            d="M24 19V29M21 21C21 19 27 19 27 22C27 25 21 23 21 26C21 29 27 29 27 26"
            stroke="#529365"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'seguro':
      return (
        <svg {...common}>
          <path
            d="M24 6L37 11V21C37 30 31 37 24 41C17 37 11 30 11 21V11L24 6Z"
            fill="#A8D9F3"
          />
          <path
            d="M18 24L22 28L30 19"
            stroke="#4E91BC"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )

    case 'maquillaje':
      return (
        <svg {...common}>
          <rect
            x="13"
            y="10"
            width="22"
            height="28"
            rx="4"
            fill="#E6A9D4"
          />
          <circle cx="20" cy="19" r="3" fill="#C77FB3" />
          <circle cx="28" cy="19" r="3" fill="#A981D6" />
          <circle cx="20" cy="28" r="3" fill="#F0C3A2" />
          <circle cx="28" cy="28" r="3" fill="#D68D9C" />
        </svg>
      )

    case 'espejo':
      return (
        <svg {...common}>
          <circle
            cx="24"
            cy="20"
            r="11"
            fill="#BDE6F7"
            stroke="#6BAAC7"
            strokeWidth="2"
          />
          <path
            d="M20 32H28"
            stroke="#6BAAC7"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'perfume':
      return (
        <svg {...common}>
          <rect
            x="15"
            y="16"
            width="18"
            height="23"
            rx="4"
            fill="#C7A9EE"
          />
          <rect
            x="19"
            y="10"
            width="10"
            height="7"
            rx="2"
            fill="#9372D3"
          />
          <path
            d="M22 10V6H29"
            stroke="#7255B1"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'camara':
      return (
        <svg {...common}>
          <rect
            x="8"
            y="14"
            width="32"
            height="24"
            rx="5"
            fill="#7C83B9"
          />
          <path
            d="M16 14L19 9H29L32 14"
            fill="#626A9F"
          />
          <circle
            cx="24"
            cy="26"
            r="7"
            fill="#C8E8F7"
          />
          <circle
            cx="24"
            cy="26"
            r="4"
            fill="#7F94C8"
          />
        </svg>
      )

    case 'mochila':
      return (
        <svg {...common}>
          <path
            d="M15 18C15 11 19 7 24 7C29 7 33 11 33 18V39H15V18Z"
            fill="#8AA9D9"
          />
          <path
            d="M19 18C19 14 21 12 24 12C27 12 29 14 29 18"
            stroke="#587BAF"
            strokeWidth="2"
          />
          <rect
            x="18"
            y="23"
            width="12"
            height="8"
            rx="2"
            fill="#C4D8F2"
          />
        </svg>
      )

    case 'agua':
      return (
        <svg {...common}>
          <path
            d="M17 8H31L34 40H14L17 8Z"
            fill="#8FD8F2"
          />
          <path
            d="M17 8H31V13H17V8Z"
            fill="#5CAACB"
          />
          <path
            d="M19 25C22 22 26 28 30 24"
            stroke="#D9F5FF"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'gafas':
      return (
        <svg {...common}>
          <circle
            cx="16"
            cy="25"
            r="7"
            fill="#AFC7EA"
            stroke="#5B76A7"
            strokeWidth="2"
          />
          <circle
            cx="32"
            cy="25"
            r="7"
            fill="#AFC7EA"
            stroke="#5B76A7"
            strokeWidth="2"
          />
          <path
            d="M23 24H25M9 22L6 18M39 22L42 18"
            stroke="#5B76A7"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'recuerdo':
      return (
        <svg {...common}>
          <rect
            x="10"
            y="15"
            width="28"
            height="25"
            rx="3"
            fill="#F2B0C5"
          />
          <path
            d="M10 21H38"
            stroke="#C76585"
            strokeWidth="2"
          />
          <path
            d="M24 15V40"
            stroke="#C76585"
            strokeWidth="2"
          />
          <path
            d="M24 15C19 10 14 12 17 17C19 20 24 18 24 15ZM24 15C29 10 34 12 31 17C29 20 24 18 24 15Z"
            fill="#D87898"
          />
        </svg>
      )

    case 'ropaSuciedad':
      return (
        <svg {...common}>
          <path
            d="M15 10H33V39H15V10Z"
            fill="#C7CBDC"
          />
          <path
            d="M15 10H33V16H15V10Z"
            fill="#9298AF"
          />
          <path
            d="M19 22H29M19 27H27"
            stroke="#858BA2"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'secador':
      return (
        <svg {...common}>
          <path
            d="M10 12H28C34 12 38 16 38 22C38 28 34 32 28 32H22L19 39H14L17 31H10V12Z"
            fill="#B59AE9"
          />
          <circle cx="27" cy="22" r="4" fill="#E5DFFF" />
        </svg>
      )

    case 'plancha':
      return (
        <svg {...common}>
          <path
            d="M12 31H36L31 39H14C11 39 9 36 12 31Z"
            fill="#A7B7E9"
          />
          <path
            d="M15 31L20 13H34L36 31"
            fill="#D1DAF5"
          />
          <path
            d="M22 13V8H30V13"
            stroke="#6475B3"
            strokeWidth="2"
          />
        </svg>
      )

    case 'cortauñas':
      return (
        <svg {...common}>
          <path
            d="M14 18L35 28"
            stroke="#8A91A8"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M14 28L35 18"
            stroke="#B5BBD0"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="24" cy="23" r="3" fill="#68718F" />
        </svg>
      )

    default:
      return (
        <svg {...common}>
          <rect
            x="9"
            y="9"
            width="30"
            height="30"
            rx="8"
            fill="#C7B9F2"
          />
          <path
            d="M17 24H31"
            stroke="#6944D8"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )
  }
}

/* =========================================================
   CATÁLOGO DE MALETA
   ========================================================= */

const categoriasIniciales = [
  {
    nombre: 'Ropa',
    icono: '👕',
    items: [
      { id: 1, texto: 'Camisetas', tipo: 'camiseta', hecho: false, cantidad: 4 },
      { id: 2, texto: 'Pantalones', tipo: 'pantalon', hecho: false, cantidad: 2 },
      { id: 3, texto: 'Ropa interior', tipo: 'ropa', hecho: false, cantidad: 5 },
      { id: 4, texto: 'Medias / calcetines', tipo: 'medias', hecho: false, cantidad: 5 },
      { id: 5, texto: 'Pijama', tipo: 'pijama', hecho: false, cantidad: 1 },
      { id: 6, texto: 'Zapatos cómodos', tipo: 'zapatos', hecho: false, cantidad: 1 },
      { id: 7, texto: 'Chaqueta / abrigo', tipo: 'chaqueta', hecho: false, cantidad: 1 },
      { id: 8, texto: 'Traje de baño', tipo: 'bano', hecho: false, cantidad: 1 },
    ],
  },

  {
    nombre: 'Higiene',
    icono: '🧴',
    items: [
      { id: 9, texto: 'Cepillo de dientes', tipo: 'cepillo', hecho: false },
      { id: 10, texto: 'Pasta dental', tipo: 'pasta', hecho: false },
      { id: 11, texto: 'Shampoo', tipo: 'shampoo', hecho: false },
      { id: 12, texto: 'Jabón / gel de baño', tipo: 'jabon', hecho: false },
      { id: 13, texto: 'Desodorante', tipo: 'desodorante', hecho: false },
      { id: 14, texto: 'Protector solar', tipo: 'protector', hecho: false },
    ],
  },

  {
    nombre: 'Salud y medicinas',
    icono: '💊',
    items: [
      { id: 30, texto: 'Medicamentos personales', tipo: 'medicina', hecho: false },
      { id: 31, texto: 'Botiquín básico', tipo: 'botiquin', hecho: false },
      { id: 32, texto: 'Curitas', tipo: 'curitas', hecho: false },
      { id: 33, texto: 'Repelente de insectos', tipo: 'repelente', hecho: false },
    ],
  },

  {
    nombre: 'Tecnología',
    icono: '📱',
    items: [
      { id: 22, texto: 'Celular', tipo: 'celular', hecho: false },
      { id: 23, texto: 'Cargador', tipo: 'cargador', hecho: false },
      { id: 24, texto: 'Power bank', tipo: 'powerbank', hecho: false },
      { id: 25, texto: 'Audífonos', tipo: 'audifonos', hecho: false },
      { id: 26, texto: 'Adaptador de enchufe', tipo: 'adaptador', hecho: false },
    ],
  },

  {
    nombre: 'Documentos y dinero',
    icono: '🪪',
    items: [
      { id: 34, texto: 'Pasaporte', tipo: 'pasaporte', hecho: false },
      { id: 35, texto: 'Identificación', tipo: 'identificacion', hecho: false },
      { id: 36, texto: 'Tarjetas', tipo: 'tarjeta', hecho: false },
      { id: 37, texto: 'Dinero en efectivo', tipo: 'dinero', hecho: false },
      { id: 38, texto: 'Seguro de viaje', tipo: 'seguro', hecho: false },
    ],
  },

  {
    nombre: 'Cuidado personal',
    icono: '✨',
    items: [
      { id: 16, texto: 'Secador de pelo', tipo: 'secador', hecho: false },
      { id: 17, texto: 'Plancha o tenazas de pelo', tipo: 'plancha', hecho: false },
      { id: 18, texto: 'Maquillaje', tipo: 'maquillaje', hecho: false },
      { id: 19, texto: 'Espejo de bolsillo', tipo: 'espejo', hecho: false },
      { id: 20, texto: 'Cortaúñas', tipo: 'cortauñas', hecho: false },
      { id: 21, texto: 'Perfume', tipo: 'perfume', hecho: false },
    ],
  },

  {
    nombre: 'Accesorios y viaje',
    icono: '🌎',
    items: [
      { id: 40, texto: 'Cámara', tipo: 'camara', hecho: false },
      { id: 41, texto: 'Mochila pequeña', tipo: 'mochila', hecho: false },
      { id: 42, texto: 'Botella de agua', tipo: 'agua', hecho: false },
      { id: 43, texto: 'Gafas de sol', tipo: 'gafas', hecho: false },
      { id: 44, texto: 'Bolsa para ropa sucia', tipo: 'ropaSuciedad', hecho: false },
    ],
  },

  {
    nombre: 'Recuerdos y regalos',
    icono: '🎁',
    items: [
      { id: 50, texto: 'Regalos para llevar', tipo: 'recuerdo', hecho: false, cantidad: 1 },
      { id: 51, texto: 'Espacio para recuerdos del viaje', tipo: 'recuerdo', hecho: false, cantidad: 1 },
    ],
  },
]

/* =========================================================
   PREPARACIÓN SEGÚN CLIMA
   ========================================================= */

const itemsClimaFrio = [
  { id: 60, texto: 'Ropa térmica', tipo: 'ropa', hecho: false, cantidad: 1 },
  { id: 61, texto: 'Guantes', tipo: 'ropa', hecho: false, cantidad: 1 },
  { id: 62, texto: 'Bufanda', tipo: 'ropa', hecho: false, cantidad: 1 },
]

const itemsClimaCalido = [
  { id: 63, texto: 'Ropa ligera', tipo: 'camiseta', hecho: false, cantidad: 2 },
  { id: 64, texto: 'Gorra / sombrero', tipo: 'gafas', hecho: false, cantidad: 1 },
]

function agregarItemsClima(categorias, clima) {
  if (!clima) return categorias

  const climaTexto = clima.toLowerCase()

  let extras = []

  if (
    climaTexto.includes('frío') ||
    climaTexto.includes('frio') ||
    climaTexto.includes('nevado') ||
    climaTexto.includes('fria')
  ) {
    extras = itemsClimaFrio
  }

  if (
    climaTexto.includes('cálido') ||
    climaTexto.includes('calido') ||
    climaTexto.includes('caliente')
  ) {
    extras = itemsClimaCalido
  }

  if (extras.length === 0) return categorias

  return [
    ...categorias,
    {
      nombre: 'Preparación para el clima',
      icono: '🌦️',
      items: extras,
    },
  ]
}

/* =========================================================
   FUNCIÓN PARA COMPLETAR CATÁLOGO SIN PERDER DATOS
   ========================================================= */

function combinarMaletaGuardada(guardada, clima) {
  const catalogo = agregarItemsClima(categoriasIniciales, clima)

  if (!Array.isArray(guardada) || guardada.length === 0) {
    return catalogo
  }

  return catalogo.map((categoria) => {
    const categoriaGuardada = guardada.find(
      (cat) => cat.nombre === categoria.nombre
    )

    if (!categoriaGuardada) {
      return categoria
    }

    return {
      ...categoria,
      items: categoria.items.map((item) => {
        const itemGuardado = categoriaGuardada.items?.find(
          (guardadoItem) =>
            guardadoItem.id === item.id ||
            guardadoItem.texto === item.texto
        )

        if (!itemGuardado) {
          return item
        }

        return {
          ...item,
          hecho: Boolean(itemGuardado.hecho),
          cantidad:
            item.cantidad !== undefined
              ? itemGuardado.cantidad ?? item.cantidad
              : itemGuardado.cantidad,
        }
      }),
    }
  })
}

/* =========================================================
   COMPONENTE
   ========================================================= */

function Maleta({ irADashboard, irACrearViaje, irADetalle }) {
  const [viaje, setViaje] = useState(null)
  const [datos, setDatos] = useState(categoriasIniciales)
  const [climaDestino, setClimaDestino] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [categoriaAbierta, setCategoriaAbierta] = useState(null)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setCargando(false)
        return
      }

      const { data: perfil } = await supabase
        .from('perfiles')
        .select('nacionalidad')
        .eq('id', user.id)
        .single()

      let { data: viajes } = await supabase
        .from('viajes')
        .select('*')
        .eq('user_id', user.id)
        .eq('activo', true)
        .limit(1)

      if (!viajes || viajes.length === 0) {
        const resultado = await supabase
          .from('viajes')
          .select('*')
          .eq('user_id', user.id)
          .order('creado_en', { ascending: false })
          .limit(1)

        viajes = resultado.data
      }

      if (viajes && viajes.length > 0) {
        const viajeReciente = viajes[0]

        setViaje(viajeReciente)

        const nacionalidad = nacionalidadDesde(
          viajeReciente.pasaporte,
          perfil?.nacionalidad
        )

        const { data: req } = await supabase
          .from('requisitos_visa')
          .select('clima_general')
          .eq('nacionalidad', nacionalidad)
          .ilike('destino', `%${viajeReciente.destino}%`)
          .maybeSingle()

        const clima = req?.clima_general || null

        setClimaDestino(clima)

        const maletaFinal = combinarMaletaGuardada(
          viajeReciente.maleta,
          clima
        )

        setDatos(maletaFinal)
      }

      setCargando(false)
    }

    cargar()
  }, [])

  /* =========================================================
     GUARDAR
     ========================================================= */

  const guardar = async (nuevoDatos) => {
    if (!viaje) return

    setGuardando(true)

    await supabase
      .from('viajes')
      .update({ maleta: nuevoDatos })
      .eq('id', viaje.id)

    setTimeout(() => {
      setGuardando(false)
    }, 350)
  }

  /* =========================================================
     MARCAR ITEM
     ========================================================= */

  const toggleItem = (catIndex, id) => {
    const nuevo = datos.map((categoria, index) => {
      if (index !== catIndex) return categoria

      return {
        ...categoria,
        items: categoria.items.map((item) =>
          item.id === id
            ? { ...item, hecho: !item.hecho }
            : item
        ),
      }
    })

    setDatos(nuevo)
    guardar(nuevo)
  }

  /* =========================================================
     CAMBIAR CANTIDAD
     ========================================================= */

  const cambiarCantidad = (catIndex, id, valor) => {
    const nuevo = datos.map((categoria, index) => {
      if (index !== catIndex) return categoria

      return {
        ...categoria,
        items: categoria.items.map((item) =>
          item.id === id
            ? {
                ...item,
                cantidad: Math.max(0, Number(valor)),
              }
            : item
        ),
      }
    })

    setDatos(nuevo)
    guardar(nuevo)
  }

  /* =========================================================
     ABRIR / CERRAR CATEGORÍA
     ========================================================= */

  const toggleCategoria = (index) => {
    setCategoriaAbierta((actual) =>
      actual === index ? null : index
    )
  }

  /* =========================================================
     CARGANDO
     ========================================================= */

  if (cargando) {
    return (
      <div className="maleta maleta-cargando">
        <div className="mal-loading-maleta">
          <div className="mal-loading-handle"></div>
          <div className="mal-loading-body">
            🧳
          </div>
        </div>

        <p>Preparando tu maleta...</p>
      </div>
    )
  }

  /* =========================================================
     SIN VIAJE
     ========================================================= */

  if (!viaje) {
    return (
      <div className="maleta">
        <div className="mal-header">
          <button
            className="mal-volver"
            onClick={irADashboard}
          >
            ← Volver
          </button>

          <div className="mal-logo">
            MOVIXA
          </div>
        </div>

        <div className="mal-empty">
          <div className="mal-empty-icon">
            <div className="mal-empty-suitcase">
              🧳
            </div>
          </div>

          <span className="mal-empty-kicker">
            TU PRÓXIMA AVENTURA
          </span>

          <h2 className="mal-titulo">
            Tu maleta está esperando
          </h2>

          <p className="mal-sin-info">
            Todavía no tenés ningún viaje creado.
            Cuando tengas uno, MOVIXA preparará una
            lista para ayudarte a no olvidar lo importante.
          </p>

          <button
            className="mal-boton-crear"
            onClick={irACrearViaje}
          >
            ✈ Crear mi primer viaje
          </button>
        </div>
      </div>
    )
  }

  /* =========================================================
     PROGRESO
     ========================================================= */

  const totalItems = datos.reduce(
    (acc, cat) => acc + cat.items.length,
    0
  )

  const totalHechos = datos.reduce(
    (acc, cat) =>
      acc + cat.items.filter((item) => item.hecho).length,
    0
  )

  const porcentaje =
    totalItems > 0
      ? Math.round((totalHechos / totalItems) * 100)
      : 0

  let mensajeProgreso = '¡Comencemos a preparar tu aventura!'

  if (porcentaje >= 25 && porcentaje < 50) {
    mensajeProgreso = '¡Muy bien! Ya llevas parte de la aventura contigo.'
  }

  if (porcentaje >= 50 && porcentaje < 75) {
    mensajeProgreso = '¡Más de la mitad! Tu maleta va tomando forma.'
  }

  if (porcentaje >= 75 && porcentaje < 100) {
    mensajeProgreso = '¡Casi lista! Revisa que no falte nada.'
  }

  if (porcentaje === 100) {
    mensajeProgreso = '¡Maleta lista! ✈️ Ahora sí, a disfrutar.'
  }

  return (
    <div className="maleta">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mal-header">
        <button
          className="mal-volver"
          onClick={irADashboard}
        >
          ← Volver
        </button>

        <div className="mal-logo">
          MOVIXA
        </div>
      </div>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="mal-hero">

        <div className="mal-hero-text">
          <span className="mal-kicker">
            PREPARANDO TU AVENTURA
          </span>

          <h2 className="mal-titulo">
            🧳 Tu maleta
          </h2>

          <p className="mal-destino">
            <span>✈</span>
            {viaje.destino}
          </p>

          <p className="mal-mensaje">
            {mensajeProgreso}
          </p>
        </div>

        <div className="mal-hero-suitcase">
          <div className="mal-suitcase-handle"></div>

          <div className="mal-suitcase">
            <div className="mal-suitcase-line"></div>

            <div className="mal-suitcase-sticker">
              ✈
            </div>

            <div className="mal-suitcase-tag">
              MOVIXA
            </div>

            <div className="mal-suitcase-wheel wheel-left"></div>
            <div className="mal-suitcase-wheel wheel-right"></div>
          </div>
        </div>

      </section>

      {/* =====================================================
          PROGRESO
      ===================================================== */}

      <section className="mal-progreso-card">

        <div className="mal-progreso-top">

          <div>
            <span className="mal-progreso-label">
              PREPARACIÓN
            </span>

            <strong>
              {totalHechos} de {totalItems}
            </strong>
          </div>

          <div className="mal-porcentaje">
            {porcentaje}%
          </div>

        </div>

        <div className="mal-barra">
          <div
            className="mal-barra-progreso"
            style={{ width: `${porcentaje}%` }}
          >
            <span></span>
          </div>
        </div>

        <div className="mal-progreso-footer">
          {guardando ? (
            <span>Guardando...</span>
          ) : (
            <span>✓ Guardado automáticamente</span>
          )}

          {porcentaje === 100 && (
            <span className="mal-lista-final">
              ✓ ¡Lista!
            </span>
          )}
        </div>

      </section>

      {/* =====================================================
          CLIMA
      ===================================================== */}

      {climaDestino && (
        <div className="mal-clima-card">

          <div className="mal-clima-icon">
            ☀
          </div>

          <div>
            <span>
              CLIMA DEL DESTINO
            </span>

            <strong>
              {climaDestino}
            </strong>
          </div>

          <div className="mal-clima-airplane">
            ✈
          </div>

        </div>
      )}

      {/* =====================================================
          CATEGORÍAS
      ===================================================== */}

      <div className="mal-categorias">

        {datos.map((categoria, catIndex) => {

          const hechosCategoria =
            categoria.items.filter(
              (item) => item.hecho
            ).length

          const estaAbierta =
            categoriaAbierta === catIndex

          return (
            <section
              key={categoria.nombre}
              className={`mal-categoria ${
                estaAbierta
                  ? 'mal-categoria-abierta'
                  : ''
              }`}
            >

              <button
                className="mal-categoria-header"
                onClick={() =>
                  toggleCategoria(catIndex)
                }
              >

                <div className="mal-categoria-icono">
                  {categoria.icono}
                </div>

                <div className="mal-categoria-info">

                  <strong>
                    {categoria.nombre}
                  </strong>

                  <span>
                    {hechosCategoria} de {categoria.items.length} preparados
                  </span>

                </div>

                <div className="mal-categoria-mini-progress">
                  <div>
                    <span
                      style={{
                        width: `${
                          categoria.items.length > 0
                            ? (hechosCategoria /
                                categoria.items.length) *
                              100
                            : 0
                        }%`,
                      }}
                    ></span>
                  </div>
                </div>

                <div className="mal-categoria-flecha">
                  {estaAbierta ? '⌃' : '⌄'}
                </div>

              </button>

              <div
                className={`mal-lista-wrapper ${
                  estaAbierta
                    ? 'mal-lista-abierta'
                    : ''
                }`}
              >

                <div className="mal-lista">

                  {categoria.items.map((item) => (

                    <div
                      key={item.id}
                      className={`mal-item ${
                        item.hecho
                          ? 'mal-item-hecho'
                          : ''
                      }`}
                    >

                      <div
                        className="mal-item-izquierda"
                        onClick={() =>
                          toggleItem(
                            catIndex,
                            item.id
                          )
                        }
                      >

                        <div className="mal-item-dibujo">
                          <IconoMaleta
                            tipo={item.tipo}
                            size={42}
                          />
                        </div>

                        <div className="mal-item-texto">

                          <span>
                            {item.texto}
                          </span>

                          {item.hecho && (
                            <small>
                              Empacado
                            </small>
                          )}

                        </div>

                      </div>

                      <div className="mal-item-acciones">

                        {item.cantidad !== undefined && (
                          <div className="mal-cantidad">

                            <button
                              aria-label={`Quitar una unidad de ${item.texto}`}
                              onClick={() =>
                                cambiarCantidad(
                                  catIndex,
                                  item.id,
                                  item.cantidad - 1
                                )
                              }
                            >
                              −
                            </button>

                            <span>
                              {item.cantidad}
                            </span>

                            <button
                              aria-label={`Agregar una unidad de ${item.texto}`}
                              onClick={() =>
                                cambiarCantidad(
                                  catIndex,
                                  item.id,
                                  item.cantidad + 1
                                )
                              }
                            >
                              +
                            </button>

                          </div>
                        )}

                        <button
                          className={`mal-check ${
                            item.hecho
                              ? 'mal-check-activo'
                              : ''
                          }`}
                          onClick={() =>
                            toggleItem(
                              catIndex,
                              item.id
                            )
                          }
                          aria-label={
                            item.hecho
                              ? `Desmarcar ${item.texto}`
                              : `Marcar ${item.texto}`
                          }
                        >
                          {item.hecho ? '✓' : ''}
                        </button>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            </section>
          )
        })}

      </div>

      {/* =====================================================
          FINAL
      ===================================================== */}

      {porcentaje === 100 && (
        <div className="mal-final">

          <div className="mal-final-icon">
            ✈️
          </div>

          <div>
            <strong>
              ¡Todo listo!
            </strong>

            <p>
              Tu maleta está preparada para {viaje.destino}.
            </p>
          </div>

        </div>
      )}

      {/* =====================================================
          BOTÓN VIAJE
      ===================================================== */}

      <button
        className="mal-boton-ver-viaje"
        onClick={() =>
          irADetalle(viaje.id)
        }
      >
        <span>Ver mi viaje completo</span>
        <strong>→</strong>
      </button>

    </div>
  )
}

export default Maleta