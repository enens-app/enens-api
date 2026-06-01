import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export function ormConfig(): TypeOrmModuleOptions {
    return {
        url: "mongodb+srv://kaly100diallo:qbvU9e2m6bOunXif@cluster0.rlhxa.mongodb.net/enens?retryWrites=true&w=majority&appName=Cluster0",
        type: 'mongodb',
        synchronize: true,
        logging: false,
        autoLoadEntities: true,
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        ssl: true,
        extra: {
        connectionLimit: null,
        },
        entities: [__dirname+'../**/*.entity{.js,.ts}'],
        migrations: ['dist/database/migrations/*.js'],
    }
}
