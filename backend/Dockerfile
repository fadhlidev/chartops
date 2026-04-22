# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1-alpine AS base
WORKDIR /usr/src/app
RUN apk add --no-cache curl

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# [optional] tests & build
ENV NODE_ENV=production

# RUN bun test
RUN bun build src/index.ts --compile --outfile /dist/app

# copy production dependencies and source code into final image
FROM base AS release

COPY --from=prerelease /dist/app .

# run the app
USER bun

# Expose port 8080
EXPOSE 8080/tcp

# Define a health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -s --fail http://localhost:8080/health || exit 1

# Command to run the application
ENTRYPOINT [ "./app" ]
