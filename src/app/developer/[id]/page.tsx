import { getDeveloperById } from "@/lib/data/developers";
import { getProductsByDeveloper } from "@/lib/data/products";
import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Calendar, Award, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const unresolvedParams = await params;
    const developer = await getDeveloperById(unresolvedParams.id);
    if (!developer) return {};
    return { title: `${developer.name} | OCMarket`, description: developer.description };
}

export default async function DeveloperProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const unresolvedParams = await params;
    const developer = await getDeveloperById(unresolvedParams.id);
    if (!developer) notFound();

    const products = await getProductsByDeveloper(developer.id);

    return (
        <div className="bg-muted/10 pb-20 pt-12">
            <Container>
                {/* Profile Header */}
                <div className="relative mb-12 rounded-3xl overflow-hidden bg-card border shadow-sm">
                    <div className="h-32 md:h-48 w-full bg-gradient-to-r from-primary/80 to-accent/80" />
                    <div className="px-6 pb-8 md:px-12 md:pb-12 relative flex flex-col md:flex-row gap-6 md:items-end">
                        <div className="-mt-16 md:-mt-20 relative">
                            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-lg">
                                <AvatarImage src={developer.avatar} className="object-cover" />
                                <AvatarFallback className="text-4xl">{developer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="flex-1 pb-2">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-foreground">{developer.name}</h1>
                                    <p className="text-lg text-muted-foreground mt-1 max-w-2xl">{developer.description}</p>
                                </div>
                                <Button className="shrink-0 w-full md:w-auto">Follow Developer</Button>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-6 text-sm">
                                <div className="flex items-center gap-1.5 font-medium">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-foreground">{developer.rating}</span>
                                    <span className="text-muted-foreground">({developer.reviews} reviews)</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Award className="h-4 w-4" />
                                    <span>{developer.products} Products</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>Joined {new Date(developer.joined).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <ExternalLink className="h-4 w-4" />
                                    <a href="#" className="hover:text-primary transition-colors">Website</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight">Products by {developer.name}</h2>
                    {products.length === 0 ? (
                        <div className="p-12 text-center rounded-xl border border-dashed text-muted-foreground">
                            This developer hasn't published any products yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
}
