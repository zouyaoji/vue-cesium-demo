/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-12-08 23:26:13
 * @LastEditTime: 2022-02-07 09:50:34
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\vite.config.ts
 */
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('./package.json')
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

const htmlPlugin = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      return html.replace(/<title>(.*?)<\/title>/, `<title>${process.env.VITE_VUE_APP_TITLE}</title>`)
    }
  }
}

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  return defineConfig({
    plugins: [
      vue({
        template: { transformAssetUrls }
      }),
      quasar({
        sassVariables: 'src/assets/style/public.scss'
      }),
      htmlPlugin()
    ],
    resolve: {
      alias: {
        '@src': resolve(__dirname, './src'),
        '@components': resolve(__dirname, './src/components'),
        '@composables': resolve(__dirname, './src/composables'),
        '@layouts': resolve(__dirname, './src/layouts'),
        '@pages': resolve(__dirname, './src/pages'),
        '@assets': resolve(__dirname, './src/assets'),
        '@boot': resolve(__dirname, './src/boot'),
        '@router': resolve(__dirname, './src/router'),
        '@store': resolve(__dirname, './src/store'),
        '@utils': resolve(__dirname, './src/utils'),
        '@api': resolve(__dirname, './src/api'),
        '@config': resolve(__dirname, './src/config')
      }
    },
    server: {
      host: '0.0.0.0',
      https: false,
      port: 3000,
      proxy: {
        '/customimage': {
          target: 'http://api0.map.bdimg.com/customimage',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/customimage/, '/')
        }
      }
    },
    build: {
      terserOptions: {
        compress: {
          drop_console: true
        }
      },
      brotliSize: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('/node_modules/')) {
              const modules = ['quasar']
              const chunk = modules.find(module => id.includes(`/node_modules/${module}`))
              return chunk ? `vendor-${chunk}` : 'vendor'
            }
          }
        }
      }
    },
    define: {
      __APP_VERSION__: JSON.stringify(packageJson.version)
    },
    base: './'
  })
}
