import '@contentlayer/utils/effect/Tracing/Enable'

import { provideDummyTracing } from '@contentlayer/utils'
import { pipe, T } from '@contentlayer/utils/effect'
import { getContentlayerVersion } from '@contentlayer/utils/node'
import { Builtins, Cli } from 'clipanion'
import process from 'node:process'

import { BuildCommand } from './commands/BuildCommand.js'
import { DefaultCommand } from './commands/DefaultCommand.js'
import { DevCommand } from './commands/DevCommand.js'
import { PostInstallCommand } from './commands/PostInstallCommand.js'

export const run = async () => {
  const [node, app, ...args] = process.argv

  const contentlayerVersion = await pipe(getContentlayerVersion(), provideDummyTracing, T.runPromise)

  const cli = new Cli({
    binaryLabel: `Contentlayer CLI`,
    binaryName: process.env['CL_DEBUG'] ? `${node} ${app}` : 'contentlayer',
    binaryVersion: contentlayerVersion,
  })

  cli.register(DefaultCommand)
  cli.register(DevCommand)
  cli.register(BuildCommand)
  cli.register(PostInstallCommand)
  cli.register(Builtins.HelpCommand)
  cli.register(Builtins.VersionCommand)

  // Run the CLI
  await cli.runExit(args, Cli.defaultContext)
}
