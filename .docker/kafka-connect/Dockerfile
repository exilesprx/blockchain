FROM confluentinc/cp-kafka-connect:6.0.2

ENV CONNECT_PLUGIN_PATH='/usr/share/java,/etc/kafka-connect/jars,/usr/share/confluent-hub-components'

RUN confluent-hub install --no-prompt mongodb/kafka-connect-mongodb:1.6.0