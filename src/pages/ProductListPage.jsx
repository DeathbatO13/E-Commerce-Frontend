export default function ProductListPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="layout-content-container max-w-[1200px] mx-auto">
        {/* PageHeading */}
        <div className="flex flex-wrap justify-between gap-3 p-6">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-4xl font-black leading-tight tracking-[-0.033em] text-gray-900 dark:text-white">Explora por Categoría</p>
            <p className="text-base font-normal leading-normal text-gray-500 dark:text-gray-400">Encuentra lo que buscas navegando por nuestras colecciones seleccionadas.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 pt-4">

            <a className="group" href="#">
              <div
                className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-square overflow-hidden relative transition-transform duration-300 group-hover:scale-105"
                data-alt="A smartphone and a laptop on a desk, representing the electronics category."
                style={{
                  backgroundImage:
                    'linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 40%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCn4OPzhd8Ur24hEaJBpDICezNRR82isD9YL1qasPzGqSODfo8X3D-asEfJ5SLDPd4Ujn4k-RtD1W0hUcXPPeJNtICoXqjzSJGLsE7IqyPCMtujSq-eMNN7F9d7qmWWkt1HaHWgOI1WDPByLrb6Wk9Og4LfwkHEwwT-wmULyqtCWwKI0ZFCDzHxaHBbbtkAeMHVM_lBLe20IlM-yBq93BMMNU6v_MLotIJ4Xg7LHqiEL-Si0CUZLKviwOEfl5CiYwbde_TeaR5raeye")'
                }}
              >
                <p className="text-white text-lg font-bold leading-tight">Electrónicos</p>
              </div>
            </a>

            <a className="group" href="#">
              <div
                className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-square overflow-hidden relative transition-transform duration-300 group-hover:scale-105"
                data-alt="Stylish clothes hanging on a rack, representing the apparel category."
                style={{
                  backgroundImage:
                    'linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 40%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCHpq0RLT5q8fYkKil3sHVME3i2FfJfFYcUArc6f1W-uyfuR43pgVHr9TD8WpGJY5WsItzGXLruM5D6caQaN7mHpr-_hWvk-d4rWtlfawn6qfWFxHVrrfSnpJsVvBdmyeLFMUkaM07e5k1pjFDyphlFiO8Rc9xuLXAPFj6TSnyTelLteVHn9aDi-xTOkcTJeaZ5b-rYSTltapxFiM33j5Z7UHSzwBNEVghsJvB7L7Ss3v6HqvgB9Lq41mXFNuZC9RWIPVB7W6UwWsyV")'
                }}
              >
                <p className="text-white text-lg font-bold leading-tight">Ropa y Accesorios</p>
              </div>
            </a>

            <a className="group" href="#">
              <div
                className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-square overflow-hidden relative transition-transform duration-300 group-hover:scale-105"
                data-alt="A modern living room with a sofa and plants, representing the home and garden category."
                style={{
                  backgroundImage:
                    'linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 40%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBeU9qVW8NXJKBMGzbnvhlCxgsgUl82kSdM4cc6O7cHiZWs5KRyobTALnbf_QRX0SDKEbYfkgdr1xe3QoR-QyL_7ImaEV7tMNSFn_LeJt86sjVxfbSOA_UubCv1qbL22N-mLdMIiKvdGPEukPnSGWsDwWAF43NjMQe_C6afnnFbRGEiTWLIPJ3gt2C5EwfQs6hzjSelNANjsHLlDPXn2uGbUz6xbTaf4QoSafgp0zyHrl1EPpqLqeFgkmRTGu7HDDQcJKcLggghprmq")'
                }}
              >
                <p className="text-white text-lg font-bold leading-tight">Hogar y Jardín</p>
              </div>
            </a>

            <a className="group" href="#">
              <div
                className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-square overflow-hidden relative transition-transform duration-300 group-hover:scale-105"
                data-alt="A collection of old books on a shelf, representing the books and media category."
                style={{
                  backgroundImage:
                    'linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 40%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAzPiXBObEoLQ_H7WDtDpMTVKF-g2EKlxqjaCkHm3V09YbWnsZX51hLjdhg52I4QpwAse7iUyOAGod7ZeHwtOXTaHYX_TBkDLWzF4G_Gjmb4VIDD0SI81wNZpnzKDbhRc0XK8Uh5FU0i7eaYQ85zYI3ZIBGlT8q8P9W_Wu66ArwTFuNWidWpR2yhLY9CLs-vb_js0J-phJTw2DE2rOffoW9ITH8L4-aLc8sapmo19m25Mg9Ha9vgIwlNNuRYjSp6G-uSZ64egIp9GMg")'
                }}
              >
                <p className="text-white text-lg font-bold leading-tight">Libros y Media</p>
              </div>
            </a>

            <a className="group" href="#">
              <div
                className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-square overflow-hidden relative transition-transform duration-300 group-hover:scale-105"
                data-alt="Various sports equipment like a basketball and sneakers, representing the sports category."
                style={{
                  backgroundImage:
                    'linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 40%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDb7HUDABeMcXaaP5iF417gfd_emioPTbjxoh5gwE9U8rbHHFCpw_UdJMyT_e0yEh7TRvDmJVp5GrORRtRRRWmpzEXl5VmF8Qj2rZ6U_RW0AJ_fXYFjsHBcQmEIK-1w5r0IQqwt-EWYyz2i54aZw2wfHNLBjPsfgf0L31LfsfCBU7_f3GhQSUfI9LhFT1CHZMbCcgmEyao86m5CHNnvc9tF_Q6mjh99710aovB5UX8tjWhNWzfoBxe_yxdNZTkRyyNsIWQg2pkQE2fi")'
                }}
              >
                <p className="text-white text-lg font-bold leading-tight">Deportes</p>
              </div>
            </a>

            <a className="group" href="#">
              <div
                className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-square overflow-hidden relative transition-transform duration-300 group-hover:scale-105"
                data-alt="Cosmetic products arranged neatly, representing the health and beauty category."
                style={{
                  backgroundImage:
                    'linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 40%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDPxJBrg31P1EDg-k6y6knI82f6sxJvjyH4Ln6sFCoRWFKfTq1RyJnzJ9WhkOHAds7VMmGkr2_iijKeAOHenzXnUhVO4VlAfVXn0-U2qWS6Jwiav44CfHCY96YtihFYHO4umpkx-uNghggsBhOtj8cKwbS0eJ0lG8Vc3C57G8rWh-B2gFbeJT1zCAe4-F_9gcnsfc8Q58nFaoVNJw8AOrjLUvNJGbm4BifVq0UhpY8WE5nmD9kCM92ifF4S6mo-ib2i-eWt_NXg0cTB")'
                }}
              >
                <p className="text-white text-lg font-bold leading-tight">Salud y Belleza</p>
              </div>
            </a>

            <a className="group" href="#">
              <div
                className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-square overflow-hidden relative transition-transform duration-300 group-hover:scale-105"
                data-alt="Colorful toys for children, representing the toys and games category."
                style={{
                  backgroundImage:
                    'linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 40%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBw0982QNdFMEwXgHMtUo7342oQjnF9wHVOjHmix80tflAohRpst6pU4a9AEExb8UgEuGAcP72pOEsKmCR1RLSh9x7irYDJi9eUz0ua9aSvUvTHgNYwk-398vtARd64vrj1L94HPEoeyTkAxLakF-qcXZbcQzMdciFI0opm1UZhUprt1TPbGf9Ogf6f3R21LjG5d2PDXOyFRYU8XT8N0lxLe9RVhLfKVeThEovb5Z4CZ91QT06sTbPH8bvX25CSm0jiB193bSYROpgP")'
                }}
              >
                <p className="text-white text-lg font-bold leading-tight">Juguetes y Juegos</p>
              </div>
            </a>

            <a className="group" href="#">
              <div
                className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-square overflow-hidden relative transition-transform duration-300 group-hover:scale-105"
                data-alt="Car parts and tools, representing the automotive category."
                style={{
                  backgroundImage:
                    'linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 40%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDOHXmc6LbdPj-DXKpgDQaq0xtAlNxuSsmlzE2e68wqNgv1bxJRmjIQTZiBjEdG4WckB-s98XxHL_i8BJ6w2F2rkkkcGDJdjGhSNe8fQY0nu4SRYz_XwB7RXJZPRZ4nS6nALBCBrq6rkJA0Vk8Qgc3I4O7PCYYrK-SuVXzbVWJOPatFNs7lN5yVweOdIMpc279lqqk-6Zu7aHNk5O2chzWk_KQY_QhU1-nlYh8PjIlTa0-5_jQKWlVKLTNMiSU4s-gsGEEINFP-erm6")'
                }}
              >
                <p className="text-white text-lg font-bold leading-tight">Automotriz</p>
              </div>
            </a>
        </div>

        {/* Footer */}
        <footer className="flex flex-col gap-6 px-5 py-10 text-center border-t border-gray-200 dark:border-gray-700 mt-10">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <a
              className="text-sm font-normal leading-normal text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
              href="#"
            >
              Sobre Nosotros
            </a>
            <a
              className="text-sm font-normal leading-normal text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
              href="#"
            >
              Contacto
            </a>
            <a
              className="text-sm font-normal leading-normal text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
              href="#"
            >
              Preguntas Frecuentes
            </a>
            <a
              className="text-sm font-normal leading-normal text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
              href="#"
            >
              Términos de Servicio
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {/* Social icons can be added here if needed */}
          </div>
          <p className="text-sm font-normal leading-normal text-gray-500 dark:text-gray-400">
            © 2024 E-Commerce Inc. Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </div>
  );
}