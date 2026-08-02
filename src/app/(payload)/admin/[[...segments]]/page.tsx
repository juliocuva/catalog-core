/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import configPromise from '@payload-config'
import { RootPage } from '@payloadcms/next/views'
import { importMap } from '../importMap'

export default async function Page(props: any) {
  return RootPage({ config: configPromise, importMap, ...props })
}
