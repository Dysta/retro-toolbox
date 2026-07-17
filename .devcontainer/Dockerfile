FROM debian:trixie

RUN apt-get update && apt-get install --no-install-recommends -y \
    curl \
    default-jre \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get -y autoremove

ARG FFDEC_VERSION=26.2.1
RUN curl -fsSLo ffdec.deb \
    https://github.com/jindrapetrik/jpexs-decompiler/releases/download/version${FFDEC_VERSION}/ffdec_${FFDEC_VERSION}.deb

RUN dpkg -i ffdec.deb && rm ffdec.deb
