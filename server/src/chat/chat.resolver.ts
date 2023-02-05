import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class ChatResolver {
  @Query(() => String)
  async chat(@Args('prompt', { type: () => String }) prompt: string) {
    return `This was the prompt: ${prompt}`;
  }
}
