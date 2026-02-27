FROM oven/bun:1.3 AS builder

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install

COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_BASE_PATH="/retro-toolbox"

RUN bun run build

FROM debian:trixie AS ffdec

WORKDIR /ffdec

RUN apt-get update && apt-get install --no-install-recommends -y curl

ARG FFDEC_VERSION=25.1.2
RUN curl -kfsSLo ffdec.deb \
    https://github.com/jindrapetrik/jpexs-decompiler/releases/download/version${FFDEC_VERSION}/ffdec_${FFDEC_VERSION}.deb


FROM oven/bun:1.3 AS runner

WORKDIR /ffdec

RUN apt-get update && apt-get install --no-install-recommends -y \
    default-jre \
    && apt-get -y autoremove \
    && rm -rf /var/lib/apt/lists/*

COPY --from=ffdec /ffdec/ffdec.deb .
RUN dpkg -i ffdec.deb && rm ffdec.deb

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_PUBLIC_BASE_PATH="/retro-toolbox"
ENV BASE_PATH=NEXT_PUBLIC_BASE_PATH

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

USER bun
CMD ["bun", "server.js"]