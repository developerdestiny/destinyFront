import React, { useState } from 'react'
import { Dialog, Popover } from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import logo from '../assets/logo-01.png'
import { logout } from '../redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


function Menu({backgroundcolor}) {
  const dispatch = useDispatch();
  const isUserActive = useSelector(state => state.auth.activeLogin);
  const user = useSelector(state => state.auth.usuario);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [activeSubMenu, setactiveSubMenu] = useState(false)

  const handleLoginOut = () => {
    dispatch(logout());
    navigate('/');
  }
  return (
    <header className={`w-full absolute top left z-50 ${!backgroundcolor && 'bg-gradient-to-b from-[#121212]'}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 relative" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <img className="w-48" src={ logo } alt="" />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12">
          <a href="/" className="text-sm font-semibold leading-6 text-white cursor-pointer">
            Inicio
          </a>
          <a href="/tours" className="text-sm font-semibold leading-6 text-white cursor-pointer">
            Viajes
          </a>
          <a href="/conciertos" className="text-sm font-semibold leading-6 text-white cursor-pointer">
            Conciertos
          </a>
          <a href="/hoteles" className="text-sm font-semibold leading-6 text-white cursor-pointer">
            Hoteles
          </a>
          { isUserActive ?
            <div className='relative'>
              <button className="flex gap-2 text-[#ffff] font-semibold items-center" onClick={() => setactiveSubMenu(!activeSubMenu)}>
                <i class="fa-solid fa-user text-[#ffff]"></i>
                <span className='ml-2'>Hola!, { user?.nombre }</span>
                <i className="fa-sharp fa-regular fa-circle-chevron-down text-[#ffff]"></i>
              </button>
              {activeSubMenu && 
                <div className="flex flex-col gap-2 border-2 rounded-lg absolute w-full mt-3 bg-[#010417]">
                <a href='/mi-perfil' className="font-semibold text-sm leading-7 text-[#ffff] text-right p-2 border-b-2">
                  Mi perfil
                </a> 
                <button className="text-sm font-semibold text-[#ffff] text-right p-2" onClick={handleLoginOut} > Cerrar Sesion</button>
                </div>}
            </div> : 
            <a href="/login" className="text-sm font-semibold leading-6 text-white cursor-pointer"> Iniciar Sesión / Registrate </a>
          }

        </Popover.Group>
      </nav>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[#010417] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5">
              <img
                className="w-36"
                src={ logo }
                alt=""
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-[#fff]"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">                
                <a
                  href="/"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-[#fff] hover:bg-gray-50"
                >
                   Inicio
                </a>
                <a
                  href="/tours"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-[#fff] hover:bg-gray-50"
                >
                   Viajes
                </a>
                <a
                  href="/conciertos"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-[#fff] hover:bg-gray-50"
                >
                  Conciertos
                </a>
                <a
                  href="/hoteles"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-[#fff] hover:bg-gray-50"
                >
                  Hoteles
                </a>
                <a
                  href="/tours"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-[#fff] hover:bg-gray-50"
                >
                  Tour
                </a>

              </div>
              <div className="py-6">
                { isUserActive ?
                  <div className='relative'>
                    <button className="flex gap-2 text-[#ffff] font-semibold items-center" onClick={() => setactiveSubMenu(!activeSubMenu)}>
                      <i class="fa-solid fa-user text-[#ffff]"></i>
                      <span className='ml-2'>Hola!, { user?.nombre }</span>
                      <i className="fa-sharp fa-regular fa-circle-chevron-down text-[#ffff]"></i>
                    </button>
                    {activeSubMenu && 
                      <div className="flex flex-col gap-2 border-2 rounded-lg w-full mt-3 bg-[#010417]">
                      <a href='/mi-perfil' className="font-semibold text-sm leading-7 text-[#ffff] text-right p-2 border-b-2">
                        Mi perfil
                      </a> 
                      <button className="text-sm font-semibold text-[#ffff] text-right p-2" onClick={handleLoginOut} > Cerrar Sesion</button>
                      </div>}
                  </div> : 
                  <a href="/login" className="text-sm font-semibold leading-6 text-white cursor-pointer"> Iniciar Sesión / Registrate </a>
                }
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}

export default Menu
